const fs = require('fs');
const { Octokit } = require("@octokit/core");

const DashiumModules = [];
const octokit = new Octokit();

function init(){
    octokit.request('GET /orgs/Dashium/repos', {
        org: 'org'
    }).then((val) => {
        if(val != null){
            if(val.status == 200){
                for(i=0;i<val.data.length;i++){
                    let current = val.data[i];
                    let module = {
                        "name": current.name,
                        "repo": current.html_url,
                        "license": current.license.name
                    }
                    DashiumModules.push(module);
                    fs.writeFileSync('modules.json', JSON.stringify(DashiumModules));
                }
            }
        }
    });
}

init();