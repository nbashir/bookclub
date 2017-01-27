// bookclub2/scripts/bookclubclient.js
// client-side javascript for bookclub2
"use strict"

/*
member list data returned by server in JSON format:
{
  "clubid":0,
  "members": [
    {"id":4, "name":"Saira Inam", "joined":"2015-05-09"},
    {"id":7, "name":"Miraj Bashir", "joined":"2012-06-13"}
  ]
}
member list data in HTML table format:
<table>
  <tr><th.Member Name<th>Joined Date
  <tr><td><a href=dyn/member/4>Saira Inam</a><td>2015-05-09
  <tr><td><a href=dyn/member/7>Miraj Bashir</a><td>2016-06-13
</table>
*/
function mktable(members){
      let html=""
      html+=`<table><tr><th>Member Name<th>Joined Date`
      for(let i in members) {
        let member=members[i]
        html+=`<tr><td><a href=dyn/member/${member.id}>${member.name}</a><td>${(new Date(member.joined)).toLocaleDateString()}`
      }
      html+=`</table>`
      return html
}


window.addEventListener("DOMContentLoaded", function(event) {

  /*
  tbl0.addEventListener("click", function(event) {
    out.insertAdjacentHTML("beforeend", "<p>table was clicked")
    console.dir(event)
  })
  */
 
  let clckbtn = document.getElementsByName("togglebtn") 

  for (let i=0; i<clckbtn.length; ++i) {
    clckbtn[i].addEventListener("click", function(event) {
      let icon=event.target // icon is <i> element
      let row=event.target.parentNode.parentNode.parentNode
      let rowidx=row.rowIndex
      // XHR is also called AJAX
      let clubid=clckbtn[i].dataset.clubid
      let xhr=new XMLHttpRequest() //call the constructor for XMLHTTPRequest
      if(xhrprops.format.value === "table") {
        xhr.open("GET", `dyn/club/${clubid}?format=table`)
      } else if(xhrprops.format.value === "json") {
        xhr.open("GET", `dyn/club/${clubid}?format=json`)
        xhr.responseType="json"
      }
      xhr.addEventListener("load", function() {
        let memberlisttable=""
        if(xhrprops.format.value === "table") {
          memberlisttable=xhr.response
        } else if(xhrprops.format.value === "json") {
          memberlisttable=mktable(xhr.response.members)
        }
        if(icon.textContent==="add"){
          row.insertAdjacentHTML("afterend", "<tr><td><td colspan=4>" + memberlisttable)
          icon.textContent="remove"
        } else {
          let rmrow=row.nextSibling
          rmrow.outerHTML=""
          icon.textContent="add"
        }
      })
      xhr.addEventListener("error", function() {
        console.log("Error on HTTP request")
      })
      xhr.send()
    })
  }
})
