const pool = require("./connection");
//Получить все записи о Точках 
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
      DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
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
  const [rows] = await pool.query(sql, params);
  return formatRowsToJson(rows, type);
} 

// --- объединение Base + Poligons ---
async function getAllPointsCombined(lang) {
  const base = await fetchPoints("base", lang);
  const poligons = await fetchPoints("poligons", lang);
  return { ...base, ...poligons };
}

//Получение информации по коду вида точек и системы координат
async function getKodLoad(lang) {
  const [rows] = await pool.query(`
    SELECT c.id, ct.value AS name
    FROM codes c
    JOIN code_translations ct ON ct.code_id = c.id
    WHERE ct.lang = ?
  `, [lang]);

  return rows;
}


//Вспомогательная функция выбора таблицы
function getTableName(type) {
  if (type === "Base") return "points_Base_geo";
  if (type === "poligons") return "points_poligons_geo";
  throw new Error("Неверный тип таблицы");
}
function getGroupTable(type) {
  if (type === "Base") return "base_plots";
  if (type === "poligons") return "poligons_plots";
  throw new Error("Неверный тип таблицы");
}

// Получить одну запись
async function getPointById(type, id, groupName) {
  console.log(type, id, groupName);

  // Определяем, это Base или Poligons
  let groupTable, groupField, joinField, idField;
  if (["niv", "trig"].includes(groupName)) {
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
  const [rows] = await pool.query(`
    SELECT 
      p.point_id, 
      p.x, 
      p.y, 
      p.vycka,
      DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
      p.systemCoordinates_id,
      p.positionType_id,
      ${joinField}.${groupField} AS group_name,   -- название группы
      ${joinField}.${idField} AS group_id         -- числовой ID группы
    FROM ${table} p
    JOIN ${groupTable} ${joinField} ON p.group_name = ${joinField}.${idField}
    WHERE p.point_id = ? AND ${joinField}.${groupField} = ?;
  `, [id, groupName]);

  // Если нашли — возвращаем объект, если нет — null
  return rows.length > 0 ? rows[0] : null;
}

// 🔹 Добавить
async function addPoint(type, point) {
  const table = getTableName(type);
  const { point_id, group_name, x, y, vycka, date, systemCoordinates_id, positionType_id } = point;
  await pool.query(
    `INSERT INTO ${table} (point_id, group_name, x, y, vycka, date, systemCoordinates_id, positionType_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [point_id, group_name, x, y, vycka, date, systemCoordinates_id, positionType_id]
  );
  return true;
}

// 🔹 Обновить
async function updatePoint(type, id, fields) {
  const table = getTableName(type);
  const keys = Object.keys(fields).map((k) => `${k}=?`).join(", ");
  if (!keys) throw new Error("Нет данных для обновления");
  await pool.query(`UPDATE ${table} SET ${keys} WHERE point_id=?`, [...Object.values(fields), id]);
  return true;
}

// 🔹 Удалить
async function deletePoint(type, id) {
  const table = getTableName(type);
  await pool.query(`DELETE FROM ${table} WHERE point_id=?`, [id]);
  return true;
}

module.exports = {
  getAllPointsCombined,
  getKodLoad,
  getPointById,
  addPoint,
  updatePoint,
  deletePoint,
};
