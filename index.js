
// get the modal by ID
var myModal = document.getElementsByClassName('modalID')[0];

// Initialize Firebase
var config = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "..."
};
firebase.initializeApp(config);
 

//autenticacion
var loginMail = function(){
    var email = document.getElementById('user_email').value;
    var password = document.getElementById('user_psw').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log('logueado correctamente');
        window.location = "./back_restaurant_app.html";
    })
    .catch(function(error){
        document.getElementById('messageAuth').innerHTML='';
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('ha ocurrido un error:' +''+ errorMessage +'||'+ errorCode);
        document.getElementById('messageAuth').style.visibility = 'visible';
        errorAuthTraductor(error.code);
      });

    function errorAuthTraductor(eCode){
        switch (eCode) {
            case eCode = 'auth/invalid-email':
                 document.getElementById('messageAuth').innerHTML='El formato de la dirección de correo es incorrecta.';
            break;
            case eCode = 'auth/wrong-password':
                 document.getElementById('messageAuth').innerHTML='La constraseña es invalida o el usuario no la tiene.';
            break;
            case eCode = 'auth/user-not-found':
                 document.getElementById('messageAuth').innerHTML='El usuario pudo haber sido eliminado.';
            break;
            default:
                break;
        }   
    }

      
}


//sesion:auth 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('sesion activa');
      console.log(firebase.auth().currentUser);
      document.getElementById('currentUser').appendChild(document.createTextNode(firebase.auth().currentUser.email))
      //console.log(firebase.auth().currentUser.email)
    } else {
        console.log('No autorizado');
         //console.log(window.location.pathname);
        //redirecciono al index si no esta autentificado
        if(window.location.pathname != "/_react/cli_react/rback_restaurant_app/index.html"){
            window.location.href = './index.html';
        }
    }
    
  });

//login con facebook
/*var loginFacebook = function(){
    if(!firebase.auth().currentUser){
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('public_profile'); //get username, profile, etc
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            console.log(user);

            console.log('logueado correctamente');
            window.location = "./back_restaurant_app.html";
            //var name = result.displayName;
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }
}*/

//document.getElementById('btn-facebook').addEventListener('click', loginFacebook, false);

  //user signOut
var signOut = function(){
    
    firebase.auth().signOut()
    .then(
        function(){
          console.log('sesion cerrada exitosamente');
        },
        function(error){
          console.log('ha ocurrido un error:'+ error);
        }
    )
}

var database = firebase.database();
//firebase.database().goOffline();



//cargar formulario de items
function cargarFormulario(e){
    e.preventDefault();
    var nombreP = document.getElementById('nombrePlatillo').value;
    var descripcionP = document.getElementById('descripcionPlatillo').value;
    var cantidadP = document.getElementById('cantidadPlatillo').value;
    var precioP = document.getElementById('precioPlatillo').value;
    var linkImagenP = document.getElementById('imagenPlatillo').value;
    var nombreImagenP = document.getElementById('nombreImagenPlatillo').value;
    
    try {
        agregarAlimento(nombreP, descripcionP, cantidadP, precioP, nombreImagenP, linkImagenP)
    } catch (error) {
        console.log('ha ocurrido un error' + error);
    }

}

//agregar item al listado de platillos
var agregarAlimento = function(nombreP, descripcionP, cantidadP, precioP, nombreImgP, linkImgP){
    database.ref('alimentos/').push(
        {
            nombre: nombreP,
            descripcion: descripcionP,
            cantidad: cantidadP,
            precio: precioP,
            nombreImg: nombreImgP,
            linkImg: linkImgP
        }
    )
    .then(
        function(){
            alert('registro agregado correctamente');  
            window.location.href = './listadoPlatillos.html'; 
         }
    )
    .catch(
        function(error){
            alert('Ha ocurrido un error:' + error);
        }
    )
}

//imprimir datos del listado platillos
function imprimirListadoPlatillos(){
    let query = database.ref('alimentos/');
        //value: lee y detecta cambios; snapshot: captura de los objetos
            query.once("value", function(snapshot){
                if(snapshot.val() == null){
                    document.getElementById('listadoPlatillos').
                    appendChild(document.createTextNode('No se encuentran registros...'));
                }
                else{
                    document.getElementById('LoadPreview_listPlt').style.display = 'none';
                    snapshot.forEach(
                        function(childSnapshot){
                            //llave y objeto
                            var key = childSnapshot.key;
                            var obj = childSnapshot.val();

                            var lista = document.getElementById('listadoPlatillos');
                            var ul = document.createElement('ul');

                            var li = document.createElement('li');
                            var div = document.createElement('div');
                            var img = document.createElement('img');
                            
                            var btnElim = document.createElement('button');
                            var btnAct = document.createElement('button');

                            li.setAttribute('id', key);
                            btnElim.setAttribute('id', key);
                            btnElim.appendChild(document.createTextNode('Eliminar'));
                            btnElim.setAttribute('onClick', 'eliminarItemPlatillo(this.id)');

                            btnAct.setAttribute('id', key);
                            btnAct.appendChild(document.createTextNode('Editar'));
                            btnAct.setAttribute('onClick', 'editarItemPlatillo(this.id)');

                            img.src = obj.linkImg;
                            img.height = '40';
                            img.alt = 'img_platillo';

                            div.appendChild(img);
                            li.appendChild(div);
                            li.appendChild(document.createTextNode('Nombre:' + obj.nombre));
                            li.appendChild(document.createElement('br'));
                            li.appendChild(document.createTextNode('Descripcion:' + obj.descripcion));
                            li.appendChild(document.createElement('br'));
                            li.appendChild(document.createTextNode('Precio: $'+ obj.precio));
                            li.appendChild(document.createElement('br'));
                            li.appendChild(btnElim);
                            li.appendChild(btnAct);

                            ul.appendChild(li);
                            lista.appendChild(ul);

                            ul.setAttribute('class', 'list-group list-hover');
                            li.setAttribute('class', 'list-group-item');
                            div.style.float = 'right';     
                        }
                  );
                }
            });
            //escucha actualizacion
            query.on("child_changed", function(snapshot){
                let key = snapshot.key;
                let obj = snapshot.val();

                const liPlatillosChanged = document.getElementById(snapshot.key);

                //limpiamos y volvemos a setear
                liPlatillosChanged.innerHTML = '';

                let div = document.createElement('div');
                let img = document.createElement('img');
                let btnElim = document.createElement('button');
                let btnAct = document.createElement('button');

                btnElim.setAttribute('id', key);
                btnElim.appendChild(document.createTextNode('Eliminar'));
                btnElim.setAttribute('onClick', 'eliminarItemPlatillo(this.id)');

                btnAct.setAttribute('id', key);
                btnAct.appendChild(document.createTextNode('Editar'));
                btnAct.setAttribute('onClick', 'editarItemPlatillo(this.id)');

                img.src = obj.linkImg;
                img.height = '40';
                img.alt = 'img_platillo';

                div.appendChild(img);
                liPlatillosChanged.appendChild(div);
                liPlatillosChanged.appendChild(document.createTextNode('Nombre:' + obj.nombre));
                liPlatillosChanged.appendChild(document.createElement('br'));
                liPlatillosChanged.appendChild(document.createTextNode('Descripcion:' + obj.descripcion));
                liPlatillosChanged.appendChild(document.createElement('br'));
                liPlatillosChanged.appendChild(document.createTextNode('Precio: $'+ obj.precio));
                liPlatillosChanged.appendChild(document.createElement('br'));
                liPlatillosChanged.appendChild(btnElim);
                liPlatillosChanged.appendChild(btnAct);
                div.style.float = 'right';
                liPlatillosChanged.style.backgroundColor = '#e8f5e9';
                setTimeout(function(){
                    liPlatillosChanged.removeAttribute('style');
                }, 3000);
            });

            //escucha eliminacion de platillo
            query.on("child_removed", function(snapshot){
                let key = snapshot.key;
                let obj = snapshot.val();

                const liPlatillosDel = document.getElementById(snapshot.key);
                liPlatillosDel.style.backgroundColor = '#ffcdd2';
                setTimeout(function(){
                    liPlatillosDel.remove();
                    alert('item eliminado correctamente');
                }, 2000);  
            });
};

//MODAL - Editar platillo 
function editarItemPlatillo(ID){
    var query = database.ref("alimentos/"+ID);
    query.once('value')
    .then(
        function(snapshot){
            var data = snapshot.val();
            var key = snapshot.key;

            var myModalInstance = new Modal(myModal, 
            { 
                content: `
                <div class="modal-header">
                    <h4 class="modal-title">Editar Platillo</h4>
                </div>
                <class="modal-body"> 
                    <div class="col-md-12">
                            <form  action="#" onSubmit="return actualizarFormularioPlatillo(event)" name="formularioPlatillos_act">
                                <input type="text" id="idPlatillo_act" value="${key}" hidden> 
                                cambiar imagen: <input class="btn btn-default" type="file" id="imgPlatillo_new" onchange="visualizarImagenPlatillo_act()"><br><br>
                                <img src="${data.linkImg}" alt="img_platillo_Act" height="100" id="imgPlatillo_act" class="center-block">
                                <p class="text-center" id="imgPlatillosBarAct">
                                   ...
                                </p>
                                <br><br> 
                                Nombre Imagen: <input type="text" class="form-control" type="text"  id="nombreImagenPlatillo_act" required value="${data.nombreImg}" readonly/>
                                Enlace: <input class="form-control" type="text" name="imagenPlatillo" id="imagenPlatillo_act" value="${data.linkImg}" readonly/>
                                <hr>
                                nombre: <input  class="form-control" type="text"  id="nombrePlatillo_act" required value="${data.nombre}">
                                <br>
                                Descripcion:
                                    <textarea class="form-control"  id="descripcionPlatillo_act" cols="20" rows="2" required>${data.descripcion}</textarea>
                                <br>
                                Cantidad: <input class="form-control" type="number" min="0" max="10" id="cantidadPlatillo_act" value="${data.cantidad}">
                                <br>
                                    Precio: <input class="form-control" type="text"  id="precioPlatillo_act" value="${data.precio}">
                                <br>
                                <input class="btn btn-success center-block" type="submit" value="Actualizar">
                            </form>
                    </div>
                </div>
                <div class="modal-footer">     
                </div>
                `, // sets modal content
                backdrop: 'static', // we don't want to dismiss Modal when Modal or backdrop is the click event target
                keyboard: false // we don't want to dismiss Modal on pressing Esc key

            });

            myModalInstance.show();  
        }
    );
    
}

//capturar los datos del for modal y llamar a la funcion para actualizar en fb
function actualizarFormularioPlatillo(e){
    e.preventDefault();
    var ModalActPlatilloInstance = new Modal(myModal);
    ModalActPlatilloInstance.hide();

    var _keyPlatillo_act = document.getElementById('idPlatillo_act').value;
    var _nombrePlatillo_act = document.getElementById('nombrePlatillo_act').value;; 
    var _descripcionPlatillo_act = document.getElementById('descripcionPlatillo_act').value;
    var _precioPlatillo_act = document.getElementById('precioPlatillo_act').value; 
    var _cantidadPlatillo_act = document.getElementById('cantidadPlatillo_act').value; 
    var _nombreImgPlatillo_act = document.getElementById('nombreImagenPlatillo_act').value;
    var _linkImgPlatillo_act = document.getElementById('imagenPlatillo_act').value;
    
    actualizarAlimento(_keyPlatillo_act, _nombrePlatillo_act, _descripcionPlatillo_act, _precioPlatillo_act, _cantidadPlatillo_act, _nombreImgPlatillo_act, _linkImgPlatillo_act);
}
//funcion para actualizar en fb
var actualizarAlimento = function(keyPlat_act, nombrePlat_act, descripcionPlat_act, precioPlat_act, cantidadPlat_act, nombreImgP_act, linkImgP_act){
    database.ref('alimentos/' + keyPlat_act)
    .update({
            nombre: nombrePlat_act,
            descripcion: descripcionPlat_act,
            precio: precioPlat_act,
            cantidad : cantidadPlat_act,
            nombreImg: nombreImgP_act,
            linkImg: linkImgP_act
        })
        .then(
            function(){
                alert('registro actualizado!')
                //reloadPage();
            }
        )
}

//eliminar item del listado platillo
function eliminarItemPlatillo(id){
    var r = confirm("Esta seguro de que quiere eliminar este item?");
    if (r == true) {
         database.ref('alimentos/' + id).remove();
    } else {
        alert('operacion cancelada');
    }
}

function reloadPage(){
    location.reload(true);
}

/*
se hace la validacion de la imagen subida para tener vista previa,
se sube imagen existente en instancia storage de firebase 
*/
const storage = firebase.storage();
const storageRef = storage.ref();
function visualizarImagenPlatillo()
{
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var lector = new FileReader();

    lector.onloadend = function(){
        preview.src = lector.result;
    }

    if(file){
        lector.readAsDataURL(file);

        var uploadFileStorage = storageRef.child('platillos/' + file.name).put(file);

            // Listen for state changes, errors, and completion of the upload.
            uploadFileStorage.on('state_changed', 
            function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            //funcion para cargar progressbar
            document.getElementById('imgPlatillosBar').style.width = parseInt(progress) + '%'; 
            //casos para pausar o correr carga
                switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
            }, function(error) {
            switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
            }, function() {
            // Upload completed successfully, now we can get the download URL
            console.log(uploadFileStorage.snapshot.downloadURL);
            document.getElementById('imagenPlatillo').value = uploadFileStorage.snapshot.downloadURL;
            document.getElementById('nombreImagenPlatillo').value = file.name;
            });
    }
    else{
        preview.src="";
    }
}

//actualizar imagen platillos
function visualizarImagenPlatillo_act(){
    var preview_platillos_act = document.getElementById('imgPlatillo_act');
    var file_platillos_act = document.getElementById('imgPlatillo_new').files[0];
    var lector_platillos_act = new FileReader();
    var nameImagenPlatillo_act = document.getElementById('nombreImagenPlatillo_act').value;


    lector_platillos_act.onloadend = function(){
        preview_platillos_act.src = lector_platillos_act.result;
    }

    if(file_platillos_act){
        lector_platillos_act.readAsDataURL(file_platillos_act);

        // Create a reference to the file to delete
        var desertRef = storageRef.child('platillos/'+nameImagenPlatillo_act);
        // Delete the file
        desertRef.delete()
            .then(function() {
                console.log('File deleted successfully');
                    var uploadFileStoragePlt_act = firebase.storage().ref().child('platillos/'+file_platillos_act.name).put(file_platillos_act);
                    // Listen for state changes, errors, and completion of the upload.
                    uploadFileStoragePlt_act.on('state_changed', 
                        function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        //funcion para cargar progressbar
                        document.getElementById('imgPlatillosBarAct').innerHTML = parseInt(progress) + '%';                 
                        //casos para pausar o correr carga
                        switch (snapshot.state) {
                                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                    case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                                }
                        }, function(error) {
                        switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        }
                        }, function() {
                            // Upload completed successfully, now we can get the download URL
                            console.log(uploadFileStoragePlt_act.snapshot.downloadURL);
                            document.getElementById('imagenPlatillo_act').value = uploadFileStoragePlt_act.snapshot.downloadURL;
                            document.getElementById('nombreImagenPlatillo_act').value = file_platillos_act.name;
                            console.log(document.getElementById('nombreImagenPlatillo_act').value)
                    });
            })
            .catch(function(error) {
                console.log('Uh-oh, an error occurred!' + error);
            });
            
    }
    else{
        preview_platillos_act.src="";
    }
}

/***
 * BEBIDAS
 */
//listado bebidas
var imprimirListadoBebidas  = function(){
    var query = database.ref('bebidas/');
    //value: lee y detecta cambios; snapshot: captura de los objetos
    query.on('value', function(snapshot){

        if(snapshot.val() == null){
            console.log(snapshot.val() == null);
            document.getElementById('listadoBebidas').
            appendChild(document.createTextNode('No se encuentran registros...'));
        }
        else{
            document.getElementById('LoadPreview_listBeb').style.display = 'none';
            var lista = document.getElementById('listadoBebidas');
            lista.innerHTML = '';
            snapshot.forEach(
                function(childSnapshot){
                  //llave y objeto
                  var key = childSnapshot.key;
                  var obj = childSnapshot.val();

                  var ul = document.createElement('ul');
    
                  var li = document.createElement('li');
                  var div = document.createElement('div');
                  var img = document.createElement('img');
                  
                  var btn = document.createElement('button');
    
                  btn.setAttribute('id', key);
                  btn.appendChild(document.createTextNode('Eliminar'));
                  btn.setAttribute('onClick', 'eliminarItemBebidas(this.id)');
    
                  img.src = obj.imagen;
                  img.height = '40';
                  img.alt = 'img_bebida';
    
                  div.appendChild(img);
                  li.appendChild(div);
                  li.setAttribute('id', key);
                  li.appendChild(document.createTextNode('Nombre:' + obj.nombre));
                  li.appendChild(document.createElement('br'));
                  li.appendChild(document.createTextNode('Descripcion:' + obj.descripcion));
                  li.appendChild(document.createElement('br'));
                  li.appendChild(document.createTextNode('Precio: $'+ obj.precio));
                  li.appendChild(document.createElement('br'));
                  li.appendChild(btn);
    
                  ul.appendChild(li);
                  lista.appendChild(ul);
    
                  ul.setAttribute('class', 'list-group');
                  li.setAttribute('class', 'list-group-item');
                  div.style.float = 'right';
      
                }
            );

        }
       
    });
}

//visualizarImagen Bebidas 
function visualizarImagenBebidas()
{
    var preview_beb = document.getElementById('imgBebidaId');
    var file2 = document.getElementById('imgBebida').files[0];
    var lector2 = new FileReader();

    lector2.onloadend = function(){
        preview_beb.src = lector2.result;
    }

    if(file2){
        lector2.readAsDataURL(file2);

        var uploadFileStorage_beb = firebase.storage().ref().child('bebidas/' + file2.name).put(file2);
            // Listen for state changes, errors, and completion of the upload.
            uploadFileStorage_beb.on('state_changed', 
            function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            //funcion para cargar progressbar
            document.getElementById('imgBebidasBar').style.width = parseInt(progress) + '%'; 
            
            //casos para pausar o correr carga
            switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
            }, function(error) {
            switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
            }, function() {
            // Upload completed successfully, now we can get the download URL
            console.log(uploadFileStorage_beb.snapshot.downloadURL);
            document.getElementById('imagenBebidas').value = uploadFileStorage_beb.snapshot.downloadURL;
            });

    }
    else{
        preview_beb.src="";
    }
}   

var cargarFormularioBebidas = function(e){
    e.preventDefault();
    var imagen = document.getElementById('imagenBebidas').value;
    var nombre = document.getElementById('nombreBebidas').value;
    var descripcion = document.getElementById('descripcionBebidas').value;
    var cantidad = document.getElementById('cantidadBebidas').value;
    var precio = document.getElementById('precioBebidas').value;

    try {
        cargarBebida(nombre, descripcion, cantidad, precio, imagen)
    } catch (error) {
        alert('ha ocurrido un error');
    }
}

var cargarBebida  = function(nombreB, descripcionB, cantidadB, precioB, imagenB){
    database.ref('bebidas/').push(
        {
            nombre: nombreB,
            descripcion: descripcionB,
            cantidad: cantidadB,
            precio: precioB,
            imagen: imagenB
        }
    )
    .then(
        function(){
            alert('registro agregado correctamente');  
            window.location.href = './listadoBebidas.html';
         }
    )
    .catch(
        function(error){
            alert('Ha ocurrido un error:' + error);
        }
    )
}

//eliminar item del listado: bebidas
function eliminarItemBebidas(id){
    var r = confirm("Esta seguro de que quiere eliminar este item?");
    var liBebidasDel = document.getElementById(id);
    if (r == true) {
        database.ref('bebidas/' + id).remove()
        .then(
            function(){
                liBebidasDel.style.backgroundColor = '#ffcdd2';
                setTimeout(function(){
                    liBebidasDel.remove();
                    alert('item eliminado correctamente');    
                }, 2000);
               // reloadPage();
            }
        )
        .cath(
            function(error){
                alert('se ha producido un error:' + error);
            }
        );
    } else {
        alert('operacion cancelada');
    }
}


var LoginAnonimo = document.getElementById('authAnonimus');
var LogoutAnonimo = document.getElementById('outAnonimous');
/*LoginAnonimo.AddEventListener('click', function(e){
    
});*/

function singAnonimus(){
    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}

/*firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      console.log(user);
      LogoutAnonimo.style.visibility = 'visible';
      console.log('logueado correctamente');
      window.location = "./back_restaurant_app.html";
    } else {
      // User is signed out.
      // ...
      LogoutAnonimo.style.visibility = 'hidden';

    }
    // ...
  });*/

