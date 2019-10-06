const provinces = require("./json_data/provinces");
const districts = require("./json_data/districts");
const wards = require("./json_data/wards");
const tree = require("./json_data/tree");
module.exports = {
  getProvinces: () => provinces,
  getDistricts: () => districts,
  getWards: () => wards,
  getProvincesWithDetail: () => tree,
  getDistrictsByProvinceCode: (provinceCode) => districts.filter(x => x.province_code == provinceCode),
  getWardsByDistrictCode: (districtCode) => wards.filter(x => x.district_code == districtCode),
  getWardsByProvinceCode: (provinceCode) => wards.filter(x => x.province_code == provinceCode)
};
