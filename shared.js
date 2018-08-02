function updateQueryStringParam(key, value) {
	var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
		urlQueryString = document.location.search,
		newParam = key + '=' + value,
		params = '?' + newParam;
	if (urlQueryString) {
		keyRegex = new RegExp('([\?&])' + key + '[^&]*');
		if (urlQueryString.match(keyRegex) !== null) {
			params = urlQueryString.replace(keyRegex, "$1" + newParam);
		} else {
			params = urlQueryString + '&' + newParam;
		}
	}
	window.history.replaceState({}, "", baseUrl + params);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var offlineTasks = {
	"getTaskList":function (callback) {
		chrome.storage.local.get(["tasksList"], function(liste) {
			liste = liste["tasksList"] || [];
			callback(liste);
		});
	},
	"is_saved": function (id, callback) {
		var key = "task_" + id;
		chrome.storage.local.get([key], function(result) {
			result = result[key];
			callback(result && result != undefined);
		});
	},
	"getTask": function (id, callback) {
		var key = "task_" + id;
		chrome.storage.local.get([key], function(result) {
			callback(result[key]);
		});
	},
	"saveTask": function (id, content, callback) {
		this.getTaskList(function(liste) {
			if (liste.indexOf(id) == -1) {
				liste.push(id);
			}
			var key = "task_" + id;
			var setRequest = {};
			setRequest[key] = content;
			chrome.storage.local.set(setRequest, function() {
				chrome.storage.local.set({"tasksList" : liste}, function () {
					callback();
				});
			});
		});
	},
	"forgetTask": function (id, callback) {
		this.getTaskList(function(liste) {
			var liste2 = []
			for (var i in liste) {
				if (liste[i] != id) {
					liste2.push(liste[i]);
				}
			}
			chrome.storage.local.set({"tasksList" : liste2}, function() {
				chrome.storage.local.remove(["task_" + id], callback);
			});
		});
	},
};