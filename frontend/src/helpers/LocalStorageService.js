// LocalStorageService.js

// https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
const LocalStorageService = (function(){
    var _service;
    function _getService() {
        if(!_service) {
          _service = this;
          return _service
      }
      return _service
    }
    function _setToken(tokenObj) {
      localStorage.setItem(‘access_token’, tokenObj.access_token);
      localStorage.setItem(‘refresh_token’, tokenObj.refresh_token);
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
   return {
      getService : _getService,
      setToken : _setToken,
      getAccessToken : _getAccessToken,
      getRefreshToken : _getRefreshToken,
      clearToken : _clearToken
    }
   })();
   export default LocalStorageService;