angular.module('prad.service.oauth', ["ngCordova.plugins.oauthUtility"])

.factory('pradOauth', ['$q', '$http', '$cordovaOauthUtility', function ($q, $http, $cordovaOauthUtility) {
    return function(clientId, clientSecret) {
        var SERVER = 'localhost:8080';
        var AUTH_URI = 'http://' + SERVER + '/login/?next=' + encodeURIComponent('/oauth2/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=http://localhost/callback');
        var TOKEN_URI = 'http://' + SERVER + '/oauth2/access_token/';

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        var deferred = $q.defer();

        if(window.cordova) {
            var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
            if(cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {

                var browserRef = window.open(AUTH_URI, "_blank", "location=yes,clearsessioncache=no,clearcache=yes");
                browserRef.addEventListener("loadstart", function(event) {
                    if((event.url).indexOf("http://localhost/callback") === 0) {
                        var authCode = (event.url).split("code=")[1];
                        var data = "client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=authorization_code&code=" + authCode;

                        // Using the authorization_code from the redirect, request an access token with client credentials
                        $http({
                            method: "post",
                            url: TOKEN_URI,
                            data: data
                        })
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(data, status) {
                            deferred.reject("Problem authenticating");
                        })
                        .finally(function() {
                            setTimeout(function() {
                                browserRef.close();
                            }, 10);
                        });
                    }
                });
                browserRef.addEventListener('exit', function(event) {
                    deferred.reject("The sign in flow was canceled");
                });
            } else {
                deferred.reject("Could not find InAppBrowser plugin");
            }
        } else {
            deferred.reject("Cannot authenticate via a web browser");
        }
        return deferred.promise;
    }
}]);
