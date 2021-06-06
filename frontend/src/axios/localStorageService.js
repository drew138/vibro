
// https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
const LocalStorageService = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service
    }
    return _service
  }
  function _setToken(tokenObj) {
    localStorage.setItem("access", tokenObj.access_token);
    localStorage.setItem("refresh", tokenObj.refresh_token);
  }
  function _getAccessToken() {
    return localStorage.getItem("access");
  }
  function _getRefreshToken() {
    return localStorage.getItem("refresh");
  }
  function _clearToken() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }


  function _setUserValues(values) {
    for (const key of Object.keys(values)) {
      localStorage.setItem(key, values[key]);
    }
  }
  function _getUserValues() {
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const first_name = localStorage.getItem("first_name");
    const last_name = localStorage.getItem("last_name");
    const celphone = localStorage.getItem("celphone");
    const phone = localStorage.getItem("phone");
    const email = localStorage.getItem("email");
    const company = localStorage.getItem("company");
    const user_type = localStorage.getItem("user_type");
    const is_active = localStorage.getItem("is_active");
    const picture = localStorage.getItem("picture");
    return {
      id,
      username,
      first_name,
      last_name,
      celphone,
      phone,
      email,
      company,
      user_type,
      is_active,
      picture
    }
  }
  function _clearUserValues() {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("celphone");
    localStorage.removeItem("phone");
    localStorage.removeItem("email");
    localStorage.removeItem("company");
    localStorage.removeItem("user_type");
    localStorage.removeItem("is_active");
    localStorage.removeItem("picture");

  }


  return {
    getService: _getService,
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    setUserValues: _setUserValues,
    getUserValues: _getUserValues,
    clearUserValues: _clearUserValues
  }
})();

const localStorageService = LocalStorageService.getService();
export default localStorageService;