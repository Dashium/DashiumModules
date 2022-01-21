const fs = require('fs');
const { Octokit } = require("@octokit/core");
const request = require('request');

const DashiumModules = [];
const octokit = new Octokit();

function Get_requires(repo) {
    var url = `https://raw.githubusercontent.com/${repo}/main/dashium_module.json`;
    request(url, async function (error, response, body) {
        if(error != null){
            return logger('err', error);
        }
        if(body != null){
            if(body != "404: Not Found"){
                var get_content = JSON.parse(body);
                var requires = JSON.stringify(get_content.require) || "null";
                return requires;
            }
            else{
                return "null";
            }
        }
    });
}

function Get_version(repo) {
    var url = `https://raw.githubusercontent.com/${repo}/main/dashium_module.json`;
    request(url, function (error, response, body) {
        if(error != null){
            return logger('err', error);
        }
        if(body != null){
            if(body != "404: Not Found"){
                var get_content = JSON.parse(body);
                var version = get_content || "null";
                return version;
            }
            else{
                return "null";
            }
        }
    });
}

function init(){
    octokit.request('GET /orgs/Dashium/repos', {
        org: 'org'
    }).then((val) => {
        if(val != null){
            if(val.status == 200){
                for(i=0;i<val.data.length;i++){
                    let current = val.data[i];
                    module(current);
                }
            }
        }
    });
}

init();

function logger(lvl, content){
    switch(lvl){
        case 'err':
            console.log(`ERROR: ${content}`);
            break;
        case 'info':
            console.log(`LOG: ${content}`);
            break;
        default:
            console.log(`LOG: ${content}`);
    }
}

async function module(current) {
    var version = Get_version(current.full_name) || "null";
    var requires = Get_requires(current.full_name) || "null";
    var module = {
        "name": current.name,
        "repo_name": current.full_name,
        "repo_url": current.html_url,
        "version": version,
        "license": current.license.name,
        "requires": requires
    }
    DashiumModules.push(module);
    fs.writeFileSync('modules.json', JSON.stringify(DashiumModules));
}

function get_url(url) {
    if(url == null){
        logger('err', `No argument found on get_url function !`);
        return false;
    }
    request(url, function (error, response, body) {
        if(error != null){
            return logger('err', error);
        }
        if(body != null){
            return body;
        }
    });
}