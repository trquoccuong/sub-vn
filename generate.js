const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const EXCEL_PATH = path.resolve(__dirname, "./excel");
const JSON_PATH = path.resolve(__dirname, "./json_data");
const DEFAULT_SHEET = "Sheet1";
const files = fs.readdirSync(EXCEL_PATH);
let provinces = [],
  districts = [],
  wards = [];
let tree = {};
files.forEach(file_name => {
  if (file_name.includes("tỉnh")) {
    const provinces_workbook = XLSX.readFile(
      path.resolve(EXCEL_PATH, file_name)
    ).Sheets[DEFAULT_SHEET];
    provinces = XLSX.utils
      .sheet_to_json(provinces_workbook, { raw: true })
      .map(x => ({
        code: x["Mã"],
        name: x["Tên"],
        unit: x["Cấp"]
      }))
      .filter(x => x.code);
    fs.writeFileSync(
      path.resolve(JSON_PATH, "provinces.json"),
      JSON.stringify(provinces, null, 2)
    );
  } else if (file_name.includes("huyện")) {
    const districts_workbook = XLSX.readFile(
      path.resolve(EXCEL_PATH, file_name)
    ).Sheets[DEFAULT_SHEET];
    districts = XLSX.utils
      .sheet_to_json(districts_workbook, { raw: true })
      .map(x => ({
        code: x["Mã"],
        name: x["Tên"],
        unit: x["Cấp"],
        province_code: x["Mã TP"],
        province_name: x["Tỉnh / Thành Phố"],
        full_name: `${x["Tên"]}, ${x["Tỉnh / Thành Phố"]}`
      }))
      .filter(x => x.code);
    fs.writeFileSync(
      path.resolve(JSON_PATH, "districts.json"),
      JSON.stringify(districts, null, 2)
    );
  } else if (file_name.includes("xã")) {
    const wards_workbook = XLSX.readFile(path.resolve(EXCEL_PATH, file_name))
      .Sheets[DEFAULT_SHEET];
    wards = XLSX.utils
      .sheet_to_json(wards_workbook, { raw: true })
      .map(x => ({
        code: x["Mã"],
        name: x["Tên"],
        unit: x["Cấp"],
        district_code: x["Mã QH"],
        district_name: x["Quận Huyện"],
        province_code: x["Mã TP"],
        province_name: x["Tỉnh / Thành Phố"],
        full_name: `${x["Tên"]}, ${x["Quận Huyện"]}, ${x["Tỉnh / Thành Phố"]}`
      }))
      .filter(x => x.code);
    fs.writeFileSync(
      path.resolve(JSON_PATH, "wards.json"),
      JSON.stringify(wards, null, 2)
    );
  }
});

provinces.forEach(province => {
  tree[province.code] = province;
});

districts.forEach(district => {
  if (!tree[district.province_code].districts) {
    tree[district.province_code].districts = {};
  }
  tree[district.province_code].districts[district.code] = district;
});

wards.forEach(ward => {
  if (!tree[ward.province_code].districts[ward.district_code].wards) {
    tree[ward.province_code].districts[ward.district_code].wards = {};
  }
  tree[ward.province_code].districts[ward.district_code].wards[
    ward.code
  ] = ward;
});
fs.writeFileSync(
  path.resolve(JSON_PATH, "tree.json"),
  JSON.stringify(tree, null, 2)
);
