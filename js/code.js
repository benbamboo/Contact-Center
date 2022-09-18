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
 	let email = document.getElementById("loginEmail").value;
 	document.getElementById("registerResult").innerHTML = "";
	
 	/* check if created account is valid
 	- all entries exist and aren't empty
 	- password == retyped password
 	*/

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
 				if (firstName === "" || lastName === "" || login === "" || password === "" || email === "")
 				{
 					document.getElementById("registerResult").innerHTML = "Please enter all forms.";
 					return;
 				}

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
	let email = document.getElementById("searchEmail").value;
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

				// if no results
				if (jsonObject.results === undefined)
				{
					document.getElementById("contactSearchResult").innerHTML = "No records found!";
					return;
				}

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{	
					let str = jsonObject.results[i]; // one contact
					contactList += "<tr>";
					for (let j = 0; j < 5; j++)
					{
						// hide ID
						if (Object.keys(str)[j] == "ID")
						{
							continue;
						}
						// prints each field (FirstName / LastName / Email / Phone)
						contactList += ("<td>" + str[Object.keys(str)[j]] + "</td>");
						if (j < 4)
						{
							contactList += "\t";
						}
					}
					// add update/delete button for each jsonObject.results[i]
					contactList += `<td><button type='button' id='updateButton' class='buttons' onclick="window.location.href = 'updateContact.html';">Update</button>`
					contactList += `<td><button type='button' id='deleteButton' class='buttons' onclick='deleteContact(${JSON.stringify(str)});'>Delete</button></tr>`
					
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
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

function readPrevInfo(str)
{
	// try to put current contact info in input fields
	let prevFirst = str["FirstName"];
	let prevLast = str["LastName"];
	let prevEmail = str["Email"];
	let prevPhone = str["Phone"];
}

function updateContact(str)
{
	let contactFirstName = document.getElementById("contactFirst").value;
	let contactLastName = document.getElementById("contactLast").value;

	let email = document.getElementById("contactEmail").value;
	let phone = document.getElementById("contactPhone").value;
	let id = str["ID"];
	document.getElementById("contactUpdateResult").innerHTML = "";

	let tmp = {FirstName:contactFirstName,LastName:contactLastName,Email:email,Phone:phone,ID:id};
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
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";

				setTimeout(function(){window.location.href = "contact.html";}, 1000);
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
				//searchContact();

				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";

				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}