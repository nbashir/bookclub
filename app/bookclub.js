// bookclub2/bookclub.js
'use strict'

//require loads desired object of node like http, pg, url.......
let http=require('http')
let pg=require("pg")
let urlmod=require("url")
let qs=require("querystring")

let basehref="/apps/bookclub2/"
/*
   <form action=...>
     <button type=submit>Submit</button>
   </form>
   <form id=deleteform action=...></form>
   ....
   <button form=deleteform type=submit>Submit</button>
   */
let port=3000
let conname="postgres://pguser@localhost/bookclub"
//console.log("chk conname" +conname +port)

// new club html function

function mkallclubshtml(clubs) {
  let html=""
  html+=`<!DOCTYPE html><html><head><title>Bookclub List</title><base href="${basehref}">`
  html+="<link href=https://fonts.googleapis.com/icon?family=Material+Icons rel=stylesheet>"
  html+="</head><body>"
  html+=`<a href>HOME</a><br>`
  html+=`<a href=html/newclub.html>Create New Club</a>`
  html+=`<h1>Book Club List</h1>`
  html+="<form id=xhrprops><input type=radio name=format value=json checked>JSON<input type=radio name=format value=table>Table</form>"
  html+="<p>"
  html+=`<table id=tbl0><tr><th><th>Name<th>Description<th>Edit<th>Delete`
  for(let i in clubs) {
    let club=clubs[i]
    let clubid=club.id
    html+="<tr>"
    html+=`<td><button id=addbtn${i} name=togglebtn data-clubid=${clubid} type=button><i class="material-icons">add</i></button>`
    //html+=`<td><button id=addbtn${i} name=togglebtn type=button data-clubid=${clubid}><i class="material-icons">add</i></button>`
    html+=`<td><a href=dyn/club/${clubid}>${club.name}</a><td>${club.descr}`
    html+=`<td><button form=edtform type=submit formaction=dyn/club/${clubid}><i class="material-icons">create</i></button>`
    html+=`<td><button form=delform type=submit formaction=dyn/club/${clubid}><i class="material-icons">clear</i></button>`
  }
  html+=`</table>`
  html+="<output id=out></output>"
  html+=`<form id=delform method=post><input type=hidden name=action value=delete></form>`  
  html+=`<form id=edtform method=post><input type=hidden name=action value=edit></form>`  
  html+=`<form id=addform></form>`  
  html+=`<script src=scripts/bookclubclient.js></script>`
  html+=`</body></html>`
return html
}

// club member html function

function mkclubmembertable(members){
      let html=""
      html+=`<table><tr><th>Member Name<th>Joined Date`
      for(let i in members) {
        let member=members[i]
        html+=`<tr><td><a href=dyn/member/${member.memberid}>${member.name}</a><td>${member.joined.toLocaleDateString()}`
      }
      html+=`</table>`
      return html
}
 
function mkclubmemberhtml(members){
      let html=""
      html+=`<!DOCTYPE html><html><head><title>Club Member List</title><base href="${basehref}"></head><body>`

      html+=`<a href>HOME</a>`
      html+=`<h1>Club Member List</h1>`
      html+=`<table><tr><th>Member Name<th>Joined Date`
      for(let i in members) {
        let member=members[i]
        html+=`<tr><td><a href=dyn/member/${member.memberid}>${member.name}</a><td>${member.joined.toLocaleDateString()}`
      }
      html+=`</table>`
      html+=`</body></html>`
      return html
}

// new club welcome page html function

function mknewclubhtml(clubname,newclubs){
let      newclub=newclubs[0].id
      let html=""
      html+=`<!DOCTYPE html><html><head><title>New Club</title><base href="${basehref}"></head><body>`
      html+=`<a href>HOME</a>`
      html+=`<h1>WelCome to ${clubname} club ${newclub}</h1>`
      html+=`</body></html>`
      return html
}

//  member infomation html

function mkmemberinfohtml(memberinformations){
      let html=""
      html+=`<!DOCTYPE html><html><head><title>Member infopage</title><base href="${basehref}"></head><body>`
      html+=`<a href>HOME</a>`
      html+=`<h1> Member Info</h1>`
      html+=`<table><tr><th>Club Name<th>Joined Date<th>description`
      for(let i in memberinformations) {
        let memberinfo =memberinformations[i]
        html+=`<tr><td><a href=dyn/club/${memberinfo.id}>${memberinfo.name}</a><td>${memberinfo.joined.toLocaleDateString()}<td>${memberinfo.descr}`
      }
      html+=`</table>`
      html+=`</body></html>`
return html
}

// delete club html function

function mkdeleteclubhtml(delclubname){
let html=""
  html+=`<!DOCTYPE html><html><head><title>Delete Bookclub</title><base href="${basehref}"></head><body>`
      html+=`<a href>HOME</a><br>`
      console.log("club is deleted")
      let clubname=delclubname.name
      html+=`<h1>FOLLOWING CLUB IS DELETED ${clubname}</h1>`
      html+=`</body></html>`
return html
}

// editone club html function

function editoneclubhtml(clubinfo,clubid){
  let resultname=clubinfo[0].name
    let resultdescr=clubinfo[0].descr
    let html=`
    <!DOCTYPE html>
  <html>
  <head>
  <title>edit club form</title>
  <base href="${basehref}">
  </head>
  <body>
  <a href>HOME</a>
  <h1>Edit Club ${clubid}</h1>
  <form action=dyn/club/${clubid} method=post>
  <input type=hidden name=action value=update>
  <fieldset>
  <legend>Club Details</legend>
  <label>Club Name
  <input type=text name=clubname value='${resultname}'>
  </label>
  <p>
  <label>Description<br>
  <textarea name=desc cols=80 rows=5>${resultdescr} </textarea>
  </label>
  <p>
  <button type=submit>Update</button>
  </fieldset>
  </form>
  </body>
  </html>
  `
return html
}

// update club html function

function mkupdateclubhtml(){
      let html=""
      html+=`<!DOCTYPE html><html><head><title>Update page </title><base href="${basehref}"></head><body>`
      html+=`<a href>HOME</a>`
      html+=`<h1>One record updated</h1>`
      html+=`</body></html>`
return html
}

//----------------------

function allclubspage(rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr !== null) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry="select name,id, descr from club"
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
      let html=mkallclubshtml(rslt.rows)
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}
    /*
       let html=""
  html+=`<!DOCTYPE html><html><head><title>Bookclub List</title><base href="/"></head><body>`
      html+=`<a href>HOME</a><br>`
      html+=`<a href=html/newclub.html>Create New Club</a>`
      html+=`<h1>Book Club List</h1>`
      html+=`<table><tr><th>Name<th>Description<th>Edit<th>Delete`
      for(let i in rslt.rows) {
        let row=rslt.rows[i]
        let clubid=row.id
      html+="<tr>"
      html+=`<td><a href=dyn/club/${clubid}>${row.name}</a><td>${row.descr}`
      html+=`<td><button form=edtform type=submit formaction=dyn/club/${clubid}>Edit</button>`
      html+=`<td><button form=delform type=submit formaction=dyn/club/${clubid}>Delete</button>`
      }
      html+=`</table>`
      html+=`<form id=edtform method=post><input type=hidden name=action value=edit></form>`  
      html+=`<form id=delform method=post><input type=hidden name=action value=delete></form>`  
      html+=`</body></html>`
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}
     */

//----------------------------
function clubmembersjson(clubid, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`select member.name,joined,memberid id from clubmember as cm join member on cm.memberid=member.id join club on cm.clubid=club.id where club.id=${clubid}`
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
      let json={clubid: clubid, members: rslt.rows}
      let jsonstr=JSON.stringify(json)
      console.log("json response " + jsonstr)
      client.end()
      rs.setHeader('Content-Type', 'application/json')
      rs.setHeader("Content-Length", Buffer.byteLength(jsonstr))
      rs.end(jsonstr)
    })
  })
}

function clubmemberstable(clubid, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`select member.name,joined,memberid from clubmember as cm join member on cm.memberid=member.id join club on cm.clubid=club.id where club.id=${clubid}`
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
     let html=mkclubmembertable(rslt.rows)
      
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}


function clubmemberspage(clubid, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`select member.name,joined,memberid from clubmember as cm join member on cm.memberid=member.id join club on cm.clubid=club.id where club.id=${clubid}`
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
     let html=mkclubmemberhtml(rslt.rows)
      
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}

//---------------------------------

function memberinfopage(memberid, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`select club.id,club.name,joined,descr from clubmember as cm join member on cm.memberid=member.id join club on cm.clubid=club.id where member.id=${memberid}`
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
      
      let html=mkmemberinfohtml(rslt.rows)
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}

//----------------------------------

function makenewclub(urlqueryparams, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`insert into club (name,descr,created) values('${urlqueryparams.clubname}','${urlqueryparams.desc}',now()) returning id`
    //client.query(qry, (qryerr, rslt)=>{
    client.query(qry, function (qryerr, rslt) {
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
      
     let html=mknewclubhtml(urlqueryparams.clubname,rslt.rows)
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}

//--------------------------------------

function deleteoneclub(clubid,rs) {
  let client=new pg.Client(conname)
 let db=client.connect(connerr=>{
    if(connerr !== null) {
      console.log("db connection error " + connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`delete from club where id=${clubid} returning name`
    client.query(qry, (qryerr, rslt)=>{
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
     let html=mkdeleteclubhtml(rslt.rows[0]) 
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}


//------------------------------------------

function editoneclub(clubid, rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    let qry=`select name,descr from club where id=${clubid}`
    client.query(qry, function (qryerr, rslt) {
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
      return
      }
  client.end()
let html=editoneclubhtml(rslt.rows,clubid)
  rs.writeHead(200, {'Content-Type': 'text/html'})
  rs.end(html)
    })
  })
}

//------------------------------------------------

function updateclub(q,clubid,rs) {
  let client=new pg.Client(conname)
  let db=client.connect(connerr=>{
    if(connerr) {
      console.log("db connection error", connerr)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
      return
    }
    //let qry=`update club set name='${q.clubname}', descr='${q.desc}' where id=${clubid} `
    let qry=`update club set name=$1, descr=$2 where id=$3 `
    //client.query(qry, (qryerr, rslt)=>{
    client.query(qry, [q.clubname, q.desc, clubid], function (qryerr, rslt) {
      if(qryerr) {
        console.log("db query error", qryerr)
        rs.writeHead(404, {'Content-Type': 'text/html'})
        rs.end('404 Not found\n')
        return
      }
    let html= mkupdateclubhtml(rslt.rows)
      client.end()
      rs.writeHead(200, {'Content-Type': 'text/html'})
      rs.end(html)
    })
  })
}

//--------------------------------------------

//http.createServer(function(rq, rs) {
http.createServer((rq, rs)=>{
  console.log("request: " + "http method " + rq.method + " url " + rq.url)
  let postdat=""
  let urlmatch
  if(rq.method === "GET" && /\/dyn\/clubs/.test(rq.url)) {
  //request #1
    // show all clubs page
    console.log("matched URL to show club list")
    allclubspage(rs)
  //} else if(rq.method === "GET" && /\/dyn\/club\/.\?/.test(rq.url)) {
  } else if(rq.method === "GET" && (urlmatch=/\/dyn\/club\/([0-9]+)\?/.exec(rq.url))) {
  //request #2a
    //show club members page
    console.log("matched URL to show club members list as table")
    console.dir(urlmatch)
    let clubid=urlmatch[1]
    console.log("clubid " + clubid + " found from url")
    let parsedurl=urlmod.parse(rq.url, true)
    console.log("parsed url object is: " + JSON.stringify(parsedurl))
    let q=parsedurl.query
    if(q.format === "table")
      clubmemberstable(clubid, rs)
    else if(q.format === "json")
      clubmembersjson(clubid, rs)
    else {
      console.error("unknown format type " + q.format)
      rs.writeHead(404, {'Content-Type': 'text/html'})
      rs.end('404 Not found\n')
    }
  } else if(rq.method === "GET" && /\/dyn\/club\/./.test(rq.url)) {
  //request #2
    //show club members page
    console.log("matched URL to show club info")
    let m=/\/dyn\/club\/./.exec(rq.url)
    console.dir(m)
    let lastslashidx=rq.url.lastIndexOf('/')
    let clubid=rq.url.substring(lastslashidx + 1)
    console.log("clubid " + clubid + " found from url at index " + (lastslashidx + 1))
    clubmemberspage(clubid, rs)
  } else if(rq.method === "GET" && /\/dyn\/member\/./.test(rq.url)) {
  //request #3 
    //show members information page
    let lastslashidx=rq.url.lastIndexOf('/')
    let memberid=rq.url.substring(lastslashidx + 1)
    console.log("memberid " + memberid + " found from url at index " + (lastslashidx + 1))
      memberinfopage(memberid, rs)
  } else if(rq.method === "GET" && /\/dyn\/club\?/.test(rq.url)) {
  // request #4
    //makes new club
    //let q=urlmod.parse(rq.url, true).query
    let parsedurl=urlmod.parse(rq.url, true)
    console.log("parsed url object is: " + JSON.stringify(parsedurl))
    let q=parsedurl.query
    console.log("query parameter object is: " + JSON.stringify(q))
    makenewclub(q, rs)
  } else if(rq.method === "POST" && /\/dyn\/club\/./.test(rq.url)) {
    rq.on("data", dat=>{
      postdat+=dat;
    })
    rq.on("end", ()=>{
      let q=qs.parse(postdat)
      let id=rq.url.substring(rq.url.lastIndexOf('/')+1)
      if(q.action === "delete") {
 // request #5
        
        //delete one club
        console.log("matched URL to delete one club ")
        let m=/\/dyn\/club\/./.exec(rq.url)
        // console.dir(m)
        let lastslashidx=rq.url.lastIndexOf('/')
        let clubid=rq.url.substring(lastslashidx + 1)
        console.log("clubid " + clubid + " found from url at index " + (lastslashidx + 1))
        deleteoneclub(clubid, rs)
      } else if(q.action === "edit") {
 // request #6
        //edit one club page
        console.log("matched URL to edit one club ")
        let m=/\/dyn\/club\/./.exec(rq.url)
        // console.dir(m)
        let lastslashidx=rq.url.lastIndexOf('/')
        let clubid=rq.url.substring(lastslashidx + 1)
        console.log("clubid " + clubid + " found from url at index " + (lastslashidx + 1))
        editoneclub(clubid, rs)
      } else if(q.action === "update") {
      // request #7
        //update club info
        console.log("matched URL to update club info ")
       // let m=/\/dyn\/club\/./.exec(rq.url)
        //console.dir(m)
        let lastslashidx=rq.url.lastIndexOf('/')
        let clubid=rq.url.substring(lastslashidx + 1)
        console.log("clubid " + clubid + " found from url at index " + (lastslashidx + 1))
        updateclub(q,clubid, rs)
      } 
    })
    
    rq.on("error", err=>{
      console.error(err)
    })
  } else {
    console.log("Error: unknown url " + rq.url)
    rs.writeHead(404, {'Content-Type': 'text/html'})
    rs.end('404 Not found\n')
  }
}).listen(port)

console.log('\nServer running at http://127.0.0.1:' + port)

