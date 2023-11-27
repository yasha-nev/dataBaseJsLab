function readServerString(url, callback) {
    var req = new XMLHttpRequest()
    
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            callback(undefined, req.responseText); 
        } else {
            callback(new Error(req.status)); 
        }
    } 

    req.open("GET", url, true);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
    req.send();
}

function call() {
    var val = "/?fname=" + document.getElementById("fname").value
    readServerString(val, function(err, response) {
        
        table = document.getElementById('table')

        query = document.getElementsByClassName('tr')
        for (q of query){
            q.remove();
        }

        tb = document.getElementById('table');
        if (!err){
            myObj = JSON.parse(response);
            for (let i in myObj){
                tr = document.createElement('tr')
                tr.className = 'tr'
                
                td_1 = document.createElement('td')
                td_1.className = "tdleft"
                td_1.textContent = myObj[i].name

                td_2 = document.createElement('td')
                td_2.textContent = myObj[i].grp
                td_2.className = "tdright"

                tr.appendChild(td_1);
                tr.appendChild(td_2);
                tb.appendChild(tr)
            }

            document.getElementById('table').appendChild(tb);
        }
    });
}