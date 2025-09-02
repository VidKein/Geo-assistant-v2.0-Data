const pool = require("./connection");

/*Регистрация*/
async function postLoginGeo(email) {
  //console.log(email);
  //выбираем по эмайлу
  const [rows] = await pool.query('SELECT * FROM users_geo WHERE email_username = ?', [email]);
  return rows;
}
/*ТОЧКИ*/
//Вспомогательная функция выбора таблицы BASE/POLIGONS
function getTableName(type) {
  if (type === "Base") return "points_Base_geo";
  if (type === "poligons") return "points_poligons_geo";
  throw new Error("Неверный тип таблицы");
}

//Получить все записи о Точках 
//Собираем полученную информацию
function formatRowsToJson(rows, type) {
 const key = type === "base" ? "Base" : "poligons";
 const result = { [key]: {} };

  rows.forEach(r => {
    if (!result[key][r.group_name]) {result[key][r.group_name] = {};}

   result[key][r.group_name][r.point_id] = {
      position: [r.x, r.y],
      vycka: r.vycka,
      date: r.date,
      systemCoordinates: r.coordinate_system,
      positionType: r.position_type
    };
  });

  return result;
  }
  //Считываем с БД
  async function fetchPoints(type, lang) {
  const table = type === "base" ? "points_Base_geo" : "points_poligons_geo";
  const groupTable = type === "base" ? "base_plots" : "poligons_plots";

  // правильное поле для связи
  const joinColumn = type === "base" ? "base_id" : "poligons_id";
  const nameColumn = type === "base" ? "name_base" : "name_poligons";

  let sql = `
    SELECT 
      p.point_id,
      b.${nameColumn} AS group_name,
      p.x, p.y, p.vycka, 
      DATE_FORMAT(date, '%Y-%m-%d'),
      ct1.value AS coordinate_system,
      ct2.value AS position_type
    FROM ${table} p
      JOIN ${groupTable} b ON p.group_name = b.${joinColumn}
      JOIN code_translations ct1 
        ON ct1.code_id = p.systemCoordinates_id AND ct1.lang = ?
      JOIN code_translations ct2 
        ON ct2.code_id = p.positionType_id AND ct2.lang = ?
  `;

  const params = [lang, lang];
  const [result] = await pool.query(sql, params);
  return formatRowsToJson(result, type);
  } 
  // объединение Base + Poligons
  async function getAllPointsCombined(lang) {
  const base = await fetchPoints("base", lang);
  const poligons = await fetchPoints("poligons", lang);
  return { ...base, ...poligons };
  }

//Получить одну запись
async function getPointById(type, id, groupName) {
  console.log(type, id, groupName);
  
  // Определяем, это Base или Poligons
  let groupTable, groupField, joinField, idField;
  if (type === "Base") {
    groupTable = "base_plots";
    groupField = "name_base";    // текстовое название группы
    joinField = "b";             // алиас таблицы
    idField = "base_id";         // числовой ID группы
  } else {
    groupTable = "poligons_plots";
    groupField = "name_poligons";
    joinField = "pl";
    idField = "poligons_id";
  }
  const table = getTableName(type);
  const [result] = await pool.query(`
    SELECT 
      p.point_id, 
      p.x, 
      p.y, 
      p.vycka,
      DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
      p.systemCoordinates_id,
      p.positionType_id,
      ${joinField}.${groupField} AS group_name,   
      ${joinField}.${idField} AS group_id         
    FROM ${table} p
    JOIN ${groupTable} ${joinField} ON p.group_name = ${joinField}.${idField}
    WHERE p.point_id = ? AND ${joinField}.${groupField} = ?;
  `, [id, groupName]);
  // Если нашли — возвращаем объект, если нет — null
  return result.length > 0 ? result[0] : null;
}

//addDat
async function postAddDat(fullInfo) {
console.log( fullInfo.dataJobs, fullInfo.dataName, fullInfo.id, fullInfo.positionX, fullInfo.positionY, fullInfo.vyckaPoint, fullInfo.date, fullInfo.coordinateSystem, fullInfo.positionType);
let point_id = fullInfo.id, 
    groupName = fullInfo.dataJobs, 
    x = fullInfo.positionX, 
    y = fullInfo.positionY,
    vycka = fullInfo.vyckaPoint, 
    date = fullInfo.date, 
    systemCoord = fullInfo.coordinateSystem, 
    posType = fullInfo.positionType;
    const table = getTableName(fullInfo.dataName);
try {
  // Проверяем, есть ли уже такая запись
     const [rows] = await pool.query(
       `SELECT * FROM \`${table}\` WHERE point_id = ?`,
       [point_id]
     );
     if (rows.length > 0) {
       return { status: "duplicate", id: point_id , groupName: fullInfo.dataName, type: groupName  };
     }

    //Получаем ID группы (ищем в base_plots и poligons_plots)
    let [rowsGrup] = await pool.query(
      `SELECT base_id as id FROM base_plots WHERE name_base = ? 
       UNION 
       SELECT poligons_id as id FROM poligons_plots WHERE name_poligons = ?`,
      [groupName, groupName]
    );
    if (rowsGrup.length === 0) throw new Error("Группа не найдена: " + groupName);
    const groupId = rowsGrup[0].id;

    //Вставляем новую точку
    const [result] = await pool.query(
      `INSERT INTO \`${table}\` 
        (point_id, group_name, x, y, vycka, date, systemCoordinates_id, positionType_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [point_id, groupId, x, y, vycka, date, systemCoord, posType]
    );
    return { status: "success", id: point_id , groupName: fullInfo.dataName, type: groupName };

  } catch (err) {
    console.error("Ошибка при добавлении точки:", err.message);
    return { success: false, error: err.message };
  }
}

//editDat
async function postEditDat(fullInfo) {
  console.log( fullInfo.dataJobs, fullInfo.dataName, fullInfo.id, fullInfo.positionX, fullInfo.positionY, fullInfo.vyckaPoint, fullInfo.date, fullInfo.coordinateSystem, fullInfo.positionType);
  let point_id = fullInfo.id, 
  groupName = fullInfo.dataJobs, 
  x = fullInfo.positionX, 
  y = fullInfo.positionY,
  vycka = fullInfo.vyckaPoint, 
  date = fullInfo.date, 
  systemCoord = fullInfo.coordinateSystem, 
  posType = fullInfo.positionType;
  const table = getTableName(fullInfo.dataName);
  try {
    //Получаем ID группы (ищем в base_plots и poligons_plots)
    let [rowsGrup] = await pool.query(
      `SELECT base_id as id FROM base_plots WHERE name_base = ? 
       UNION 
       SELECT poligons_id as id FROM poligons_plots WHERE name_poligons = ?`,
      [groupName, groupName]
    );
    if (rowsGrup.length === 0) throw new Error("Группа не найдена: " + groupName);
    const groupId = rowsGrup[0].id;

    //Вставляем новую точку
    const [result] = await pool.query(
      `UPDATE \`${table}\` 
       SET
        group_name = ?, 
        x = ?, 
        y = ?, 
        vycka = ?, 
        date = ?, 
        systemCoordinates_id = ?, 
        positionType_id  = ?
       WHERE point_id = ?`,
      [groupId, x, y, vycka, date, systemCoord, posType, point_id]
    );
    return { status: true, id: point_id , groupName: fullInfo.dataName, type: groupName };

  } catch (err) {
    console.error("Ошибка при добавлении точки:", err.message);
    return { success: false, error: err.message };
  }

}

//delatDat
async function postDelatDat(dataName, dataJobs, id) {
  console.log(dataName, dataJobs, id);
  try {
   const table = getTableName(dataName);
   // Проверяем на наличие записи БД
   const [rows] = await pool.query(
     `SELECT * FROM \`${table}\` WHERE point_id = ?`,
     [id]
   );
   if (rows.length === 0) {return { status: "nouPoint" };} 
   //Удаляем точку
   const [result] = await pool.query(
      `DELETE FROM \`${table}\` WHERE point_id = ?`,
      [id]
    );
    return { status: true};
  } catch (err) {
    console.error("Ошибка при удалении точки:", err.message);
    return { status: false, error: err.message };
  }
}


/*КОДЫ*/
//Получение информации по коду вида точек и системы координат
async function getKodLoad(lang) {
  const [result] = await pool.query(`
    SELECT c.id, ct.value AS name
    FROM codes c
    JOIN code_translations ct ON ct.code_id = c.id
    WHERE ct.lang = ?
  `, [lang]);

  const [[namberRow]] = await pool.query(`
     SELECT COUNT(*) AS count_rows
     FROM codes
     WHERE code_type_id = 1;
  `);
   const [kodBase] = await pool.query(`SELECT base_id AS id, name_base AS name FROM base_plots`);
   const [kodPoligons] = await pool.query(`SELECT poligons_id AS id, name_poligons AS name FROM poligons_plots`);
   
      return {
        codes: result,        // список кодов с переводами Типов точек и Системы координат
        count_SC: namberRow,     // количество переводов для code_id=1 Системы координат
        Base: kodBase,     // список кодов Base
        poligons: kodPoligons // список кодов Poligons
      };
}

//Вспомогательная функция выбора таблицы PLOTS BASE/POLIGONS
function getGroupTable(type) {
  if (type === "Base") return "base_plots";
  if (type === "poligons") return "poligons_plots";
  throw new Error("Неверный тип таблицы");
}
function getNameRow(type) {
  if (type === "Base") return "name_base";
  if (type === "poligons") return "name_poligons";
  throw new Error("Неверный тип таблицы");
}

//Добавление Места расположения
async function postNewPlot(namePlot, nameTyp) {
     const table = getGroupTable(nameTyp);
     const nameRow = getNameRow(nameTyp);   

     // Проверяем, есть ли уже такая запись
     const [rows] = await pool.query(
       `SELECT * FROM \`${table}\` WHERE \`${nameRow}\` = ?`,
       [namePlot]
     );
     if (rows.length > 0) {
       return { status: "duplicate", message: "Запись уже существует" };
     }
       // Добавляем новую запись
     const [result] = await pool.query(
       `INSERT INTO \`${table}\` (\`${nameRow}\`) VALUES (?)`,
       [namePlot]
     );
     return { status: "success", id: namePlot };
}
//Удаление Места расположения
async function postDelatPlot(namePlot, nameTyp, nameId) {
    const table = getGroupTable(nameTyp);
    const nameRow = getNameRow(nameTyp);
    const tableRowsPoint = getTableName(nameTyp);
    console.log(namePlot,tableRowsPoint);

    // Проверяем на наличие записи БД
    const [rows] = await pool.query(
      `SELECT * FROM \`${table}\` WHERE \`${nameRow}\` = ?`,
      [namePlot]
    );
    if (rows.length === 0) {
      return { status: "nouPlot" };
    }
    // Проверяем на наличие записи в ВАЖНЫХ таблицах с инфо по точкам
    const [rowsPoint] = await pool.query(
      `SELECT * FROM \`${tableRowsPoint}\` WHERE group_name = ?`,[nameId]
    );

    if (rowsPoint.length > 0) {
      return { status: "connetTabl", message: " есть в таблицах о точках, удалите таблицу или точку." };
    }
    //Удаляем запись
    const [result] = await pool.query(
        `DELETE FROM \`${table}\` WHERE \`${table}\`.\`${nameRow}\` = ?`,[namePlot]
       );
    return { status: "success", id: namePlot };
}
//Вспомогательная функция выбора таблицы KOD SC/TYPE
function getGroupTable(type) {
  if (type === "Base") return "base_plots";
  if (type === "poligons") return "poligons_plots";
  throw new Error("Неверный тип таблицы");
}
function getIdType(type) {
  if (type === "coordinateSystem") return 1;
  if (type === "positionType") return 2;
  throw new Error("Неверный тип таблицы");
}
//Добавление Кода
async function postNewCod(eng, ua, cz, nameTyp, siteLanguage) {
  const type = getIdType(nameTyp); // получаем id типа
  console.log(eng, ua, cz, type, siteLanguage);
  
//Создаём запись в codes
const [codeResult] = await pool.query(
  `INSERT INTO codes (code_type_id) VALUES (?)`,
  [type]
);
const codeId = codeResult.insertId;

let value;
if (siteLanguage == "eng") {
  value = eng;
}
if (siteLanguage == "ua") {
  value = ua;
}
if (siteLanguage == "cz") {
  value = cz;
}
//Проверяем, есть ли уже такая запись
const [rows] = await pool.query(
    `SELECT id FROM code_translations WHERE lang = ? AND value = ?`,
    [siteLanguage, value]
);
if (rows.length > 0) {
  return { status: "duplicate", lang: siteLanguage, value: value  };
}

//Переводы (одним INSERT с несколькими VALUES)
const [result] = await pool.query(
  `INSERT INTO code_translations (code_id, lang, value) 
   VALUES (?, 'eng', ?), (?, 'cz', ?), (?, 'ua', ?)`,
  [codeId, eng, codeId, cz, codeId, ua]
);

  return { status: "success", eng: eng, ua: ua , cz: cz };
}

//Удаление Кода
async function postDelatCod(idCod, nameCod, nameTyp) {
  console.log(idCod);
 // Проверяем на наличие записи БД
    const [rows] = await pool.query(
      `SELECT * FROM code_translations WHERE code_id = ?`,
      [idCod]
    );
    if (rows.length === 0) {return { status: "nouCod" };}

  // Удаляем переводы
  await pool.query(
    `DELETE FROM code_translations WHERE code_id = ?`,
    [idCod]
  );

  //Удаляем сам код
  const [result] = await pool.query(
    `DELETE FROM codes WHERE id = ?`,
    [idCod]
  );

  return { status: "success", nameCod : nameCod, nameTyp :nameTyp}

}

/*ЭКСПОРТ/ИМПОРТ*/
//ИМПОРТ
async function postImportPoint(type, place, dataPoint) {
  const table = getTableName(type);

  try {
    // Получаем ID группы
    let [rowsGrup] = await pool.query(
      `SELECT base_id AS id FROM base_plots WHERE name_base = ? 
       UNION 
       SELECT poligons_id AS id FROM poligons_plots WHERE name_poligons = ?`,
      [place, place]
    );

    if (rowsGrup.length === 0) {
      throw new Error("Группа не найдена: " + place);
    }

    const groupId = rowsGrup[0].id;

    // Всего точек в файле
    const totalPoints = dataPoint.length;

    // 🔎 Проверяем все point_id на дубли
    const ids = dataPoint.map(p => p.point_id);
    const [dupRows] = await pool.query(
      `SELECT point_id FROM ${table} 
       WHERE group_name = ? AND point_id IN (${ids.map(() => "?").join(",")})`,
      [groupId, ...ids]
    );

    if (dupRows.length > 0) {
      const dupList = dupRows.map(r => r.point_id).join(", ");
      return { 
        status: false, 
        error: `Импорт отменён. Дубликаты точек: ${dupList}`,
        total: totalPoints,
        added: 0
      };
    }

    // 🚀 Если дубликатов нет — вставляем все точки
    let addedPoints = [];
    for (let item of dataPoint) {
      await pool.execute(
        `INSERT INTO ${table} 
         (point_id, group_name, x, y, vycka, date, systemCoordinates_id, positionType_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.point_id,
          groupId,
          item.x,
          item.y,
          item.vycka,
          item.date,
          item.systemCoordinates_id,
          item.positionType_id
        ]
      );
      addedPoints.push(item.point_id);
    }

    return { 
      status: true, 
      message: "Импорт успешно завершён", 
      total: totalPoints,
      added: addedPoints.length,
      addedPoints
    };

  } catch (err) {
    console.error("Ошибка при импорте точек:", err.message);
    return { status: false, error: err.message };
  }
}

//ЭКСПОРТ
async function postExportPoint(type, place) {
  const table = getTableName(type);
  console.log(table, place);

  // Получаем ID группы
    let [rowsGrup] = await pool.query(
      `SELECT base_id AS id FROM base_plots WHERE name_base = ? 
       UNION 
       SELECT poligons_id AS id FROM poligons_plots WHERE name_poligons = ?`,
      [place, place]
    );

    if (rowsGrup.length === 0) {
      throw new Error("Группа не найдена: " + place);
    }

    const groupId = rowsGrup[0].id;

  const [rows] = await pool.query(
    `SELECT 
    point_id, 
    x,
    y,
    vycka, 
    DATE_FORMAT(date, '%Y-%m-%d') AS date,
    systemCoordinates_id, 
    positionType_id
     FROM ${table}
     WHERE group_name = ?`,
    [groupId]
  );
  console.log(rows);
  
  return rows;
}
module.exports = {
  postLoginGeo,
  getAllPointsCombined,
  getKodLoad,
  getPointById,
  postDelatPlot,
  postNewPlot,
  postNewCod,
  postDelatCod,
  postAddDat,
  postEditDat,
  postDelatDat,
  postImportPoint,
  postExportPoint
};
