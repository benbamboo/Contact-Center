const urlBase = 'http://contactcenters.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

 function doRegister()
 {
 	firstName = document.getElementById("firstName").value;
 	lastName = document.getElementById("lastName").value;
	
 	let login = document.getElementById("loginName").value;
 	let password = document.getElementById("loginPassword").value;
	let retype = document.getElementById("loginRetype").value;
 	let email = document.getElementById("loginEmail").value;
 	document.getElementById("registerResult").innerHTML = "";
	
 	/* check if created account is valid
 	- all entries exist and aren't empty
 	- password == retyped password
 	*/
	if (password !== retype)
	{
		document.getElementById("registerResult").innerHTML = "Passwords do not match.";
		return;
	}

 	let tmp = {FirstName:firstName, LastName:lastName, Email:email, Login:login, Password:password};
	
 	let jsonPayload = JSON.stringify( tmp ); 
	
 	let url = urlBase + '/Register.' + extension;

 	let xhr = new XMLHttpRequest();
 	xhr.open("POST", url, true);
 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 	try
 	{
 		xhr.onreadystatechange = function() 
 		{
 			if (this.readyState == 4 && this.status == 200) 
 			{
				// check if parse is either legit acct or error string
				try {
					JSON.parse(xhr.responseText);
				} catch (e) {
					document.getElementById("registerResult").innerHTML = xhr.responseText;
					return;
				}

 				saveCookie();
	
 				window.location.href = "login.html";
 			}
 		};
 		xhr.send(jsonPayload);
 	}
 	catch(err)
 	{
 		document.getElementById("loginResult").innerHTML = err.message;
 	}
 }

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let contactFirstName = document.getElementById("contactFirst").value;
	let contactLastName = document.getElementById("contactLast").value;

	let email = document.getElementById("contactEmail").value;
	let phone = document.getElementById("contactPhone").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {Phone:phone,FirstName:contactFirstName,LastName:contactLastName,UserID:userId,Email:email};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				try {
					JSON.parse(xhr.responseText);
				} catch (e) {
					document.getElementById("contactAddResult").innerHTML = xhr.responseText;
					return;
				}

				document.getElementById("contactAddResult").innerHTML = "Contact has been added";

				setTimeout(function(){window.location.href = "contact.html";}, 1000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let name = document.getElementById("searchName").value;
	let email = "";
	document.getElementById("contactSearchResult").innerHTML = "";
	document.getElementsByTagName("p")[0].innerHTML = "";
	
	let contactList = "";

	let tmp = {Name:name,Email:email,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{

				let jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject.results === undefined)
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("contactSearchResult").innerHTML = "<br></br>";
				
				contactList = "<span id='contactDeleteResult' class='text-danger mt-auto mb-3'></span><div class='row row-cols-1 row-cols-md-3 g-4 mt-1' id='contactList'>"

				for( let i=0; i<jsonObject.results.length; i++ )
				{	
					let str = jsonObject.results[i]; // one contact

					contactList += `<div class='col'><div class='card shadow-sm mb-3' style='background-color: #2c3639'>
					<div class='card-body d-flex bd-highlight'  data-bs-toggle='collapse' data-bs-target='#collapse${i}' aria-expanded='false' aria-controls='collapse${i}'><strong class='me-auto p-2 bd-highlight text-light'>`;
					contactList += str["FirstName"] + " " + str["LastName"];
					// add update/delete button for each jsonObject.results[i]
					contactList += `</strong><div class='d-grid gap-2 d-md-flex justify-content-md-end'><button type='button' id='updateButton' class='btn btn-outline-info p-2 bd-highlight' onclick='setUpPrev(${JSON.stringify(str)});'>Update</button>`;
					contactList += `<button type='button' id='deleteButton' class='btn btn-outline-danger p-2 bd-highlight' onclick='deleteContact(${JSON.stringify(str)});'>Delete</button>`;
					contactList += "</div></div></div>";
					contactList += `<div id='collapse${i}' class='collapse' aria-labelledby='heading${i}' data-bs-parent='#contactList'><div class='card card-body border-dark' style='background-color: #dcd7c9'><dl class='row'>`;

					// print rest of info (NOT FirstName / LastName)
					for (let j = 2; j < 5; j++)
					{
						// prints each field (Email / Phone) and hides ID
						if (Object.keys(str)[j] == "ID")
						{
							continue;
						} 
						else if (Object.keys(str)[j] == "Email")
						{
							contactList += "<dt class='col-sm-3'>Email</dt><dd class='col-sm-9'>" + str[Object.keys(str)[j]] + "</dd>";
						}	
						else // phone
						{
							contactList += "<dt class='col-sm-3'>Phone</dt><dd class='col-sm-9'>" + formatPhoneNumber(str[Object.keys(str)[j]]) + "</dd>";
						}
						
					}
					
					
					contactList += `</dl></div></div></div>`
				}
				contactList += "</div>";

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ')-' + match[2] + '-' + match[3];
  }
  return '';
}

function setUpPrev(str)
{
	// put current contact info in input fields
	let updatePage = `
		<div class="pb-2 mb-2 border-bottom">
			<h4 class='text-light'>Update Contact</h4>
		</div>
		<div>
			<div class="row mb-2">
				<div class="col">
					<label for="contactFirst" class="form-label text-light">First Name:</label>
					<input type="text" class="form-control" id="contactFirst" placeholder="Enter First name" value=${str["FirstName"]}>
				</div>
				<div class="col">
					<label for="contactLast" class="form-label text-light">Last Name:</label>
					<input type="text" class="form-control" id="contactLast" placeholder="Enter Last name" value=${str["LastName"]}>
				</div>
			</div>
			<div class="pb-2 mb-2">
					<label for="contactEmail" class="form-label text-light">Email:</label>
					<input type="text" class="form-control" id="contactEmail" placeholder="Enter Email" value=${str["Email"]}>
				</div>
				<div class="pb-2 mb-2">
					<label for="contactPhone" class="form-label text-light">Phone:</label>
					<input type="text" class="form-control" id="contactPhone" placeholder="Enter Phone Number" value=${str["Phone"]}>
				</div>
				<div class="pb-2 mb-2">
					<button type="button" id="update2Button" class="btn btn-outline-info btn-lg" onclick="updateContact(${str["ID"]});">Update Contact</button>
					

				</div>
				<span id="contactUpdateResult" class='text-light mt-3 mb-3'></span>
		</div>`;
	
	document.getElementsByTagName("p")[0].innerHTML = updatePage;
}

function updateContact(id)
{
	let contactFirstName = document.getElementById("contactFirst").value;
	let contactLastName = document.getElementById("contactLast").value;

	let email = document.getElementById("contactEmail").value;
	let phone = document.getElementById("contactPhone").value;
	let ID = id;
	document.getElementById("contactUpdateResult").innerHTML = "";

	let tmp = {FirstName:contactFirstName,LastName:contactLastName,Email:email,Phone:phone,ID:ID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				try {
					JSON.parse(xhr.responseText);
				} catch (e) {
					document.getElementById("contactUpdateResult").innerHTML = xhr.responseText;
					return;
				}
		
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";

				setTimeout(function(){searchContact();}, 1000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
	
}

function deleteContact(str)
{
	// (contact) = passed jsonObject.results[i]
	// let id = contact["ID"];
	let id = str["ID"];
	let tmp = {ID:id};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// remove entire row/contact from list
				// refresh page

				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";

				setTimeout(function(){searchContact();}, 1000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}
