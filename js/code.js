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
 				if (firstName === "" || lastName === "" || login === "" || password === "" || email === """)
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
	let newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
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
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{	
					// FirstName + LastName + Email + Phone
					let str = jsonObject.results[i];
					for (let j = 0; j < 5; j++)
					{
						// hide ID
						if (Object.keys(str)[j] == "ID")
						{
							continue;
						}
						contactList += str[Object.keys(str)[j]];
						if (j < 4)
						{
							contactList += "\t";
						}
					}
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

function updateContact()
{

}

function deleteContact()
{
	
}

