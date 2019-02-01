function updateIdentity(){
	let field = document.getElementById("uname");
	window.localStorage.setItem("username", field.value.toString());
	window.localStorage.setItem("id", "");
}