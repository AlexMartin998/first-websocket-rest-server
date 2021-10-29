'use strict';

console.clear();

const { serverModel } = require('./models');

// serverModel.listenServer();
serverModel.listenSocketIo();

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S16: Sockets con autenticacion
 * Vamos a expandir nuestro REST Server agregando funcionalidades Websockect Server
	- Iniciando el proyecto
	  - Instalar socket.io:       npm install socket.io


	- Configurar Socket.io
	  - Socket.io se instala en el server - Backent
		- Docs para configurar:	https://socket.io/docs/v4/
			- La parte de la API es el ejemplo
		- En el server.model: 
			- En el constructor configuro el socket.io
			  - Esto xq queremos ampliar nuestro REST Server
							// Socket.io
							this.server = createServer(this.app);
							this.io = require('socket.io')(this.server);
			- Luego creo el method sockets()
							sockets() {
								this.io.on('connection', socketController);
							}
			- Luego pongo a escuchar al server del socket io en lugar del app de express.
							listenSocketIo() {
								this.server.listen(this.port, () => {
									console.log(`Server on port ${this.port}`);
								});
							}
		- Creo el controller del socket: socket.controller.js
			- Configuro segun lo que quiero q haga el server
		- Conecto el front con el back:
		  - Creo el HTML respectivo en  /public/
			  - Para poder utilizar el websocket debemos importar:
							<script src="./socket.io/socket.io.js"></script>
									- Lo proveemos nosotros con nuestro websocket server
    					<script src="./js/chat.js"></script>
			- Creo el JS para ese front
				- El Client con el q vamos a manejar la logica.
				- Siempre crear el socket en el client: Esto funciona xq en el HTML estamos importando el   socket.io.js   q proveemos con nuestro back.
									const socket = io();


	- Diseno del Login y su funcionamiento:
	  - Trabajamos en el front: auth.js
		  - Obtuvimos los datos de cada input:
						const dataArr = [...new FormData(loginForm)];
						const data = Object.fromEntries(dataArr);
		- Enviamos la data a travez de un fetch POST para hacerun login manual
		- Almacenamos el JWT q nos envia el back al hacer login en el LocalStorage
	
	
	- Validar el JWT - Servicio
	  - Si tenemos una App con varias pantallas (rutas) debemos validar el JWT en aquellas que requieran de una autenticacion.
		  - No deberiamos poder accedar a un ruta si el JSW no es valido.
		- En este caso si no es un JWT lo sacamos de la pantalla.
		  - Esto dependeria del Frontend: Convendria q nisiquiera pueda acceder a la pantalla


	- Validar socket con JWT - Backend
	  - Para el socket io en el cliente puedo enviar extraHeaders. Asi podemos enviar el token desde el front al back para autenticar mediante websockets.
				const socket = io({
					extraHeaders: {
						'x-token': localStorage.getItem('acces_token'),
					},
				});
		- En el back lo capturamos con:   socket.handshake.headers['keyName']
		- Una vez tenemos el token lo verificamos: con un helper checkToken() 
		  - Si pasa la verificacion se retorna el user
			- Y asi en el controller de sockets (back) ya tendriamos el user autenticado


	- HTML y JS que usaremos
	  - Creamos el HTML basico para el chat

	
	- Modelo para el manejo de usuarios conectados y mensajes
	  - Creamos el Model del chat.

	
	- Listado de usuarios conectados
	  - Agregamos el user q se conecte al Arr del Users conectados en el Model del Chat
		  - Como en el back ya tengo el user autenticado gracias al: socket.handshake.headers['x-token']. Pues puedo trabajar con el en mi Model Chat.
			- Para emitir a todos los clientes sin usar el broadcast vamos a enviar el   this.io   desde el Model del Server. Entonces enviamos el socket y el this.io.
			  - Con eso ya podemos hacer un   io.emit()   q esto emite a todos los clients xq es el io.
						chatModel.connectUser(user);
 					 io.emit('user-connected', chatModel.userArr);
		- Desconectamos al user: Simplementes escuchamos el evento  disconnect en el backend
		  - Cuando se dispare, llamamos al getter del Model de Chat
						socket.on('disconnect', () => {
							chatModel.logOutUser(user.id);
							io.emit('user-connected', chatModel.userArr);
						});
	

	- Mostrar en el HTML los usuarios conectados
	  - En el front escuchamos cuando un user se conecte y enseguida ejecutamos displayUsers() para que se dibuje el hmtl.
		- Esto funciona xq desde el server emitimos a todos los clientes el Arr de usuarios conectados:  io.emit('user-connected', chatModel.userArr);


	-  Envío de mensajes a toda la sala de chat
	  - Emito el msg desde el front:   socket.emit('send-message', { message });
		- En el Back lo Escucho, se lo envio al Model y Emito los ultimos 10 messages al front, q va a estar escuchando ese evento:  io.emit('recive-message', chatModel.lastTen);
	

	- Historial de mensajes en HTML
	  - Desde el back emiti los 10 ultimos msg. Por eso en el front los capturo xq escucho el evento.
		- Una vez que tengo esa info en el front, la renderizo en el HTML
		- Estos mensajes son emitidos a una sala comun para todos los clientes.
	

	- Mensajes privados:
	  - Cuando un User se conecta el   socket   inmediatamente se va a enlazar a 2 salas:
				1. sala en la cual el   io   tiene el control total y puede enviar un msg a cualquier cliente conectado en dicha sala.
				2. se une a una sala con su propio   socket.id. Pero esto no es seguro, xq al recargarse la pagina el   socket.id    va a cambiar y ese client ya no recibiria el msg.
			- Para crear una nueva sala usamos    socket.join()
							socket.join('roomName');  // Global, socket.id, roomName
				- Con esto cada user queda unido a 3 salas diferentes
			- Ahora q ya tenemos la nueva sala por ID, vamos a preguntar si desde el front viene un   uid.
			  - Si viene el   uid: El mensaje va a ser privado para esa unica sala.
				- Si NO viene, Pues es un msg publico y se renderiza en el HTML
			- Para los msg privados solo hacemos con clg xq para renderizarlos en el html necesitariamos un  archivo HTML por cada user. Como en una app real like Whatsapp

 */

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S13: Carga de Archivos y proteccion de los mismos
 * Continuacion del proyecto REST Server
	- Continuando el REST Server
	  - Si quiero subir un archivo significa que voy a crear un nuevo recurso. Con lo cual usamos POST.
		
	- Subir / Cargar archivos
		- Hacer las validaciones nosotros. El ensena lo nuevo, q es cargar archivos.
		- npm i express-fileupload
				- Repo con example: https://github.com/richardgirges/express-fileupload/blob/master/example/server.js
				- Como es un middleware a la hora de usarlo, lo voy a colocar en el Server.model xq pueden hacer otras routes q requieran subir archivos.
				- En Postman Body > from-data > key <- file/text > value <- Seleccionamos el archivo > send
					- Y si hacemos un clg del    req.files    obtendremos la un Obj del file enviado con su key y cierta info del mismo.
				- Si enviamos 1 solo archivo podemos hacer un   drag and drop   en el front, para que al sultar se dispare la peticion con ese archivo.
		- Ya podemos subir archivos a nuestro server, pero AUN NOO podemos servirlos. XQ el path en el q se almacenan dentro del server No es un path valido <- es un un endpoint.

	- Validar la Extension
	  - Creamos un Arr de extensiones permitidas, luego verificamos q la extension del archivo q suben este en el arr.
		  - Probar con Expresiones regulares lo de las extensiones permitidas

	- Ubicar y cambiar el nombre
	  - Darle un identificador unico: UUID
		  npm i uuid

	- Helper uploadFile
	  - Refactorizamos el codigo con un helper:
		  - Cuando esperamos hacer algo que salga bien o mal y trabajar con el req y res
			  - Retornamos una promesa y trabajamos con el  resolve and  reject
			-- No me gusto que puedan enviar la extension, no se si sea inseguro ;v <- Averiguar

	- Crear carpetas de destino
	  - createParentPath <-- express-fileupload 
		  - Es peligroso xq no sabemos en donde se esta guardando
		- Si un folder esta vacio, GIT NO le va a dar seguimiento. Crear un readme.md
		- En la sig clase vamos a crear endpoints para cargar imagenes de perfil a los user

	- Ruta para actualizar imágenes de Usuarios y Productos
	  - Creamos el end point para el update <- PUT.
		  - Vamos a utilizar una f(x) q reciba argumentos en el custom:
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
			- En el helper debemos retornar algo, en este caso:  return true
		- En alguna etapa del curso hice lo mismo, pero de otra forma :v <- revisar

	- Actualizar imagen de usuario
		- Con el Put, y el nombre lo colocamos en la property img del Schema.
		
	- Resolucion de la tarea - Destructurar de undefined
	  - Crear un Middleware para validar q se este enviando el archivo. Esto lo usamos en cada endpoint/route en la q se lo necesite.

	- Borrar archivos del servidor
	  - Eliminamos las imagenes previas. Para que solo quede 1 img
		  - Construimos el path
			- Verificamos que el path exista
			- Eliminamos dicha img
		- Todavia NO podemos servir las img que se suben, eso en la proxima clase.

	- Servicio para mostrar las imagenes.
	  - Con un GET en el   route  
		- Asi tambien protegemos la imagen, porque no da informacion sobre en donde esta el recurso en nuestro server.
		  - Podriamos cargarlas a un ruta como   /api/uploads/img/users   y servirla en una ruta como   /api/images/users

	- Mostrar img de relleno
	  - Creamos el path y la servimos con un   res.sendFile('path')   tal como en la calse pasada.
		- Heroku:
			- No almacena las img, las borra despues de un tiempo para q el codigo funcione perfectamente. Y como medida de seguridad.
			- Para almacenar imgs y trabajar con Heroku debemos utilizar un hosting de imgs de terceros, x ejemplo: Cloudinary.
			- Es combeniente subir todos los archivos a otro servidor aparte, para asi proteger el codigo fuente.
		- Si despliegas un servidor linux (VPS, dedicated server) no tendrias problemas cno las img y demas contenido multimedia, pero con Heroku si debemos externalizar este alojamiento de imgs.


	- Cloudinary - Servicio para imágenes y videos
	  - Crear cuenta:
		  - Como estamos en devel del back vamos a utilizar el API Environment variable
			  - Creamos una variable de entorno en el    .env   con esa API
		- Instalamos el paquete npm:
	 			 npm install cloudinary

	- Carga de imagenes a Cloudinary
	  - La f(x)  updateImgCloudinary   es la q utilizaremos, la anterior es para guardar en el servidor mismo. Y esta es para cargarlas a un servidor aparte.
		- Como al enviar un file a nuestro server se le asigna un   tempFilePath   vamos a utilizarlo para cargarlo directamente en Cloudinary, y NO en nuestro server.
		   verlo:  console.log(req.file.keyInPostman)
		- Destructuring del secure_url y eso le metemos al model: model.img = secure_url

	- Borrar las imagenes de Cloudinary
	  - Como solo guardamos el path de la img, del mismo debemos sacar el ID de la img cargada para luego poder borrarla.
		- Ya con el public_id de la img simplemente hacemos un   cloudinary.uploader.destroy(public_id);

	- Desplegar en Heroku
	  - 

 */

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S12: Categorias y productos
 * Continuacion del proyecto REST Server
	- CRUD y rutas de Categorias
    - Categories: 
		  - Creamos todos los end points de un CRUD / REST API basico   <--   routes

	- Modelo Category
	  - Crear una referencia hacia otro Schema en el Model:
			- Debemos considerar el type y el ref
			  - type: Del tipo Schema
				- ref: 'SchemaName'
								user: {
									type: Schema.Types.ObjectId,
									ref: 'User'
								},
					El  ref  debe ser el mimo SchemaName q se le puso en el  model('SchemaName', Schema)  del Schema al q se hace referencia.

	- Create new category
	  - Empezamos x el post para explicarles como crear manteniendo la ref al User.
    - user: req.authenticatedUser._id  <-- En la data q guardo en MongoDB
		  - Debe ser un usuario de mongo, de lo contrario no funcionaria.
		  - Esto funciona xq en el Router 1ro estoy validandoJWT q crea la propiedad/key authenticatedUser en la req. Si no se ejecuta antes, deberiamos hacer algo para tener acceso al user. 

	- Modelo de producto y rutas
	  - Hacer un CRUD para productos

	- Ruta para realizar busquedas
	  - Realizar busquedas en nuestra DB
		  - Crear 1 unico end point / Route
			  - Las peticiones de busqueda suelen ser GET y los argumentos se pasan por la URL.

	- Busqueda en DB
	  - Queremos que sea flexible, por eso permitiremos que el front envie o el name, email o el ID.
		  - ID: Debemos verificar que sea un ID de Mongo valido: ObjectId.isValid(query)
			- Name and Email: Con una expresion regular para q envio todo lo q haga match.
	  -

	- Buscar en otras colecciones
	  - Si refactorizo el codigo separando la comprobacion del mongoID me da error y non se xq. Fernando tiene el mismo codigo en los 3 :v
		- Si quire realizar busqueda de productos por vategoria debo usar el Object ID
		  - {category: ObjectId('616f4c17cfa204556dc910a1')}
	
	- Desplegar a Heroku
	  - 
	
 */

/*










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S11: Google Sign In - Front y BackEnd
 * Generar API Key y API Secret de Google
  - Google Identity: https://developers.google.com/identity/gsi/web/guides/overview
	  - Vamos aqui: 
		https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
			- Luego a Google APIs console: Debemos tener una cuenta
				- Create new project > Name > Crear
				  - Selecionamos ese project > Pantall de consentimiento
					  - Interno: Solo para la organizacino
						- Externo: Para todos los q tiene cuenta de Google
					> Seleccionamos Externo > Llenamos el formulario d lo q le va a aparecer al que quira hacer sign in en nuestra app con su google account.
					> Guardar y continuar Hasta el final, luego puede editar el resto > Volver al Panel >  
					Credenciales > Crear credenciales > Crear ID de cliente OAuth > 
					  - Name > Origenes autorizados de JS: 
							- Devel: http://localhost   &   http://localhost:PORT
							- Production: dominio.tls  en el q va a estar deplegado el project
							> Guardar
					- Nos da 1 ID Client (visible para el user) y un Secret cliente (back)
				- Creamos la variable de entorno con ese ID Client

	- Usuario de Google - Frontend
	  - Vamos al HTML q tenemos en la carpeta public y colocamos lo q necesitamos
		  - Display the Sign In With Google button:
			  - Copiamos el codigo y lo pegamos en nuestro HTML.
				- Eliminamos el data-atribute:   data-login_uri  xq asi vamos a tener mas control desde nuestro back.
			- Handle credential responses with JavaScript functions:
			  - copiamos y pegamos: data-callback="handleCredentialResponse"
				- Luego la f(x) y la dejamos como un f(x) normal.
				  - El   response.credential   ya es el Google token o ID token
					  - Con esto vamos a crar un user en nuestro back.
	  - Ahora ya tenemos el ID Token de Google, y con ese ID vamos a crear un User en nuestro back.

  - Ruta para manejar autenticación de Google
    - Creamos el POST reques en el auth.routes.js
		  - el path va a ser:  /google
			- El   controller:   googleSignIn
		- Desde el front envio el id_token con un fetch con method 'POST' xq asi esta configurado el back (route).
		  - Ese  id_token  lo envio desde el front xq lo recupero de la f(x) de google: 
			  const body = { id_token: response.credential };
				  - Lo envio en formato JSON 
	
  - Validar Token de Google - Backend: Actualizado a Google Identity
	  - Verify the Google ID token on your server side:
			- npm install google-auth-library --save
					- verifyIdToken()
			- Copiamos todo el codigo para Node en un helper en nuestro vscode
				- El modulo se llama:  google-verify.js
				- Requiere de nuestro GOOGLE_CLIENT_ID del  .env
				- Destructuring de lo q necesitamos del payload de google.
					  const { name, picture, email } = ticket.getPayload();
				- Retornamos un Object con lo que necesitemos y la key q esta en nuestro User Schema <- DB - mongoose.
			- Lo q retorno el helper lo recibimos en el googleSignIn del controller personalizado. 
			
	- Crear un usuario personalizado con las credenciales de Google
	  - Estamos haciendo el Sig-in: En donde puden pasar 2 cosas:
		  - 1. El usuario no esta registrado (no lo tenemos en DB)
				- Con lo cual, lo registramos y hace login (adquiere un JWT firmado x nuestro back) /AU. Tal cual nuestro proceso manual en el back, solo q ahora con un solo click y con google :v
			- 2. Existe en nuestra DB, pero el state: false
				- NO lo dejamos hacer login/AU 
	  - Si se disparaba el catch al intentar el  .save()   
			POST http://localhost:3300/api/auth/google 400 (Bad Request)
			es xq No se esta enviando un role "valido", no envio nada, pero toma como empty string y mi back valida como uno q no esta en los roles validos.
			  - SOLUCION: 
				  - 1. En el data incluir el role q quiero
					- 2. En el user model dejar un role por default

  - Logout - Google Identity
	  - Podriamos cerrar sesion borrando las cookies :v
		- Lo que si debemos hacer es: En el HTML <- Desde el Front
		  - Cuando estamos autenticados con Google tenemos acceso a: google.accounst
			  -  console.log(google.accounts.id);
				  - Y en el id tenemos acceso al disableAutoSelect() q siempre debemos ejecutarlo.
					- revoke(email, cb)
					  - email lo obtenemos del   localStorage <- resp.user.mail     q es lo q configure q devuelva el back al hacer Sign In con la f(x) googleSignIn del auth cotroller.
			  - Luego eliminamos el email del localStorage y recargamos la pagina.
		
	- Publicar a Heroku - Google SignIn
	  - Crear las variables de entorno en heroku
		- Modificar la url del front HTML
		- En el console no se q de google agregar el dominio en donde esta desplegada la app en produccion: Adejabo de localhost y tal
			https://console.cloud.google.com/apis/credentials/oauthclient/960448950637-ji8l0jp2ignc98cp8fil283tv2sc6f50.apps.googleusercontent.com?project=curso-node-fh-329414&supportedpurview=project

		- Actualizar github
		- Subir a heroku
	
  - Pro Tip: Generar la documentación automática de nuestros servicios
	  - Tener una cuenta en Postman 
		- Collection > Clic en los 3 puntos > View documentation > Language: En el que estemos trabajado: JS con fetch. etc.
		  - Editamos como creamos conveniente
		> Click en el engrane: Configurar algo si queremos
		> Publish > Abre el navegador > Aceptar o algo asi :v  >  Ver el enlace publico a la documentacion.

 */

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S10: Autenticacion de usuario - JWT
 * Introduccion a los Tokens
	- Token: Los protegemos con una encriptacion de doble via. Facil desencriptarlos.
	  - Por esto NO grabar informacion sensible: Passwors, id, etc.
		- Un token se componer por 3 partes:
				- Header: Tiene información del algoritmo utilizado para la encriptación junto con el tipo de token, en este caso JWT.
				- Payload: Contiene la Información que nosotros queremos que esté en el token. Aunque parezca que está encriptado es muy fácil obtener ese código.
				- Firma: Da información a los verificadores del JWT si ese JWT es válido.
	
	- Informacion importante sobre los JWT
	  - Los token se almacenan en el Local Storage
			- Lo q se almacene en el Local Storage es totalmente manipulable por el client
			- Con lo cual lo va a poder modificar, por eso nuestro back debe validar q no haya sido modificado. Para esto, la Firma es lo mas importante.
			- f(x) para desencritar un JWT: Porbar con  https://jwt.io/
						function parseJwt (token) {
							var base64Url = token.split('.')[1];
							var base64 = base64Url.replace('-', '+').replace('_', '/');
							return JSON.parse(window.atob(base64));
						};
						
	- Crear ruta autenticación - Auth - Login
	  - El login va a ser un POST request. <--  Enviamod data (email & password)
	  - En el server.models.js: agregamos la ruta en el method  routes()
		  	this.app.use(this.authPath, authRoutes);
				- Esto es como lo q haciamos en el index con el de la Biblia de node, pero aqui en las Class del server en el model.
		- Luego creamos el nuevo modulo route para el autho
			- En el vamos a tener el resto del path, los middlewares y el controller.
		- Luego creamos su controller

	- Login de usuarios: Ya es hora de hacer la Autenticacion de Usuarios con JWT
	  - Solo tener un  res.json()  por f(x) en el controller
		- Validar el password: bcryptjs.compareSync() devuelve un Boolean si hace match
		  - bcryptjs.compareSync(aComparar, conQVoyAComparar)
				const validPassword = bcryptjs.compareSync(password, user.password);
	
	- Generar un JWT:     npm i jsonwebtoken
    - No retorna una Promise, sino que un Callback, x eso creamos un f(x) q retorne una promise
		  - En el helper generate-jwt.js: 
			  - El user._id pasa a ser el  uid
				- Grabamos el uid del user en el payload del token, aqui NO grabar info sensible.
			- Generar el JWT: En el helper generate-jwt.js
			  - Firmar el jwt:
				  jwt.sign(payload, secretOrPrivateKey, [options, callback])
						- payload: Pues el payload :v, lo q queremos grabar
						- secretOrPrivateKey: Llave secreta q si alguin la llega a conocer va a poder firmar tokens como si nuestro backend lo hubiera hecho. Esto es algo que debemos colocar como VARIABLE DE ENTORNO.
						- options: Podemos establecer el tiempo de vigencia del jwt. Object
						  - expireIn: 'tiempoDeVigencia'
						- callback: Se dispara con un error y el token como 2do parametro.
			  - Hasta aqui ya tenemos un login basico.
				  - El token No lo vamos a guardar en la DB
					- Cuando se requiera una accion que requiera estar autenticado, vamos a pedir el token para saber si es correcto y el q nosotros firmamos.

	- Cambiar visualmente  _id  por  uid  en Mongoose
		- Trabajsmos en el user.model.db.js: Solo hacemos esto :v
		  - Destructuring el _id, y como el dataUser es un Object, pues creamos la propiedad  uid  con el value _id que extrajimos:
					UserSchema.methods.toJSON = function () {
						const { __v, password, _id, ...dataUser } = this.toObject();
						dataUser.uid = _id;
						return dataUser;
					};

	-  Proteger rutas mediante uso de Token - Middlewares
		1. Proteger la ruta del Delete. Primera validacion q x lo menos tenga un token valido.
			- Proteger 1 ruta: crear un middleware personalizado en su carpeta respectiva
			  - Middlewares > creamos    validate-jwt.middleware.js
				  - Los JWT de acceso van en los headers
					  - Recuperamos el token q envian en los headers:
  									const token = req.header('key');
											- key deve ser la mima que envian desde el front
				  - Creamos la f(x) validateJWT en el   validate-jwt.middleware.js
							- Como es un middleware que valida el token, debe ir Primero en el Arr del  delete  en el users.routes.js
							- Ya que si da erro NO pasara al resto de middlewares
						- Validamos el JWT: Si da err lanza un trhow new Error
							- Por lo cual utilizamos un    trycatch
							- Usamos el  jsw.verify(token, secretOrPublicKey, options)
								- token: Es el que nos envian en los headers desde el front
								- secret...: La Variable de Entorno que cree para firmar el token
							- Como en el helper   generate-jwt.js   guarde el   uid en paylod, la verificacion al ser true me devuelve lo guardado en el payload. Asi que lo almacenamos en una constante
							- Creamos una nueva property/key en la   req   con ese  uid recuperado en el   .verify()
			- En la proxima clases vamos a hacer q el Delete solo funcione si es un ADMIN, y tiene el token valido q ya configuramos aqui.

	- Obtener la informacion del usuario autenticado
	  - Verificar que el usuario autenticado (usuario logueado, q logro hacer login) esta activo. Esto xq si el state es false, pues esta eliminado en nuestra app.
					
		- En las proximas clases vamos a usar ese JWT para validar ROLES de Usuarios.
		- Proceso:
		  - Creamos un nuevo usuario (validaciones)
			- Hacemos Login con el POST enviando email & pass (validaciones)
			  - Si pasa las validaciones hace login y se le asigan un JWT
					- Con lo cual ya pasa a ser un Authenticated User (AU)
			- Verificar que sea un AU / Usuario logueado para que pueda hacer algo que requiera ser un AU: 
			  Ejemplo con el Delete:
			  - Validamos si envia un token en los headers
				- Como el token es el  uid  del user q hizo login, se valida:
				  - Si existe el  uid  en la DB:
					  - SI existe, se valida q el  State  del user q tiene un token valido / hizo login:
							- true: Recien aqui se valida q sea un Authenticated User (AU)
								- Ahora si podria hacer el delete
							- false: El user existe en DB pero su state es false
								- NO tiepe permisos de AU
					- Si NO existe, pues nisiquiera es un user :v
		
	- Middleware: Verificar Rol de administrador
	 	- Creamo el middleware personalizado   validate-role.middleware.js
			- Este middleware FUERZA/OBLIGA a q sea un Admin el q haga algo en el endpoint.
	 	  - Validamos que se haya validado el usuario autenticado
			   - Con esta validacion necesitamos que, en el User Route, este middleware este Despues del q valida el JWT xq en este ultimo apregamos el AU a la req q estamos utilizando en este middleware para validar el role de Admin.

	- Middleware: Tiene rol
	  - Con este middleware el usuario con el Role que especifiquemos como parametro podra hacer lo que quiere en el end point/route que tiene dicho middleware.
		  - Mas flexible. Si tiene este rol o tal ves este otro, puedes hacer algo en este endpoint.
		- Creamos la f(x) hasUserRole() para enviar como parametro el role que deseamos, siempre que sea valido en la db. Crear en el middleware de validate-role
			- Pasar argumentos a un Middleware personalizado:
			  - Debe ser una f(x) re reciba esos Argumentos y que Retorne una f(x) con req, res, next. Es decir, una f(x) normal de todo middleware personalizado.
							return (req = request, res = response, next) => {
								.......
								next();
							}
			- Como comparamos el role q se me envia como parametro con el rol del AU, este middleware debe ejecutarse despues del q Valida el JWT.
			  		req.authenticatedUser.role

	- Optimizaciones importantes en Node
		- Crear la Variable de entorno del privateOrSecretKey en Heroku <- Firmar nuestros tokens.
		- Desplegar en GitHub
 */

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S9: Alcances del RESTServer y mantenimiento de la colección de usuarios
 * Alcances del proyecto REST Server
	- Instalaciones:   npm i cors express dotenv mongoose
	- DB Super Cafe:  DB con 3 colecciones
		- Users
			- Integrar con Google Sign in
		- Categories
		- Products
		
 * MongoDB y MongoAtlas: 
	- Crear cuenta > Crear Clouster > Database Acces > Add New DB User
		user: alexNodeJS	 || 	password: LzsQszjJwjlhGtma		> Create
	
	- Concectar user con MongoDB Compass:
		- Database > Connect > MongoDB Compass > Copiar enlace > Editamos el <password> por el que pusimos al crear el user. > Lo editado copy and paste in MongoDB Compass > Connect
	
	- Monggose: Es un ODB que nos evita escribir sintaxis propia del SGDB NoSQL
		- Retorna una Promise
		- En el   mongoose.connect(URI)  <--  Con Mongoose 6 ya no es necesario los Objects de configuracion.
					https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options

	- User Model: Schema del user q sera guardado en la DB. Va en el Model
		- En MongDB guardamos Documents (Objects) y estos a su vez se guardan en Collections. El equivalente de un collection es una tabla en DB SQL.
		- Crear el Schema del Document: 
			- Require  Schema  y  model
				- Schema: Data la estructura/schema al document (obj)
				- model: Nos permitira exportar nuestro Schema

	- POST: Crear un User en la Collection
		- Configuramos el user.Controller xq tiene la logica
			
				const user = new User(body);		<-		instanciamos el Shema
				await user.save();							<-		guardamos en la DB

	- BcryptJS - Encriptando la contraseña
		- Encriptar la contrasena con un Hash de 1 sola via. Imposible de revertir
				npm i bcryptjs
					- Generamos el salt: Complejidad del hash, 10 por default
							const salt = bcryptjs.genSaltSync();
					- Hash de 1 sola via al password
							user.password = bcryptjs.hashSync(password, salt);

		- Evitar que se pueda modificar el  google: true  desde el front
			- Validar todos los endpoints monuciosamente. No confiar en el q hace el frontend  :v

	- Validar Campos Obligatorios - Email
			npm i express-validator 		<--		Es una gran collection of Middlewares
				- En el Route hacemos un  .check('toValidate', 'Error messg').isEmail()
							- toValidate <- key en el Schema q esta en el model
					- Se pasa como 2do parametro, si son varios middlewares usamos un Arr
						router.post(
							'/',
							[check('mail', "It's not a valid email.").isEmail()],
							postUser <- controller
						);
					- Esto guardara los errores en el mismo express-validator
					- Esos errores los validamos con un Middleware personalizado

	- Validar todos los campos necesarios
		- Validamos Si NO esta Empty:  
					check('name', 'Name is required.').not().isEmpty(),
		- Creamos el Middleware personalizado y solo lo pasamos al final de los 
			check() en el Route
		- En el mismo Arr de Middlewares, xq los  check()  tambien son Middlewares
		- Como los errores de las validaciones se guardan el el propio  express-validatos debemos  require  en el Middleware personalizado.
					const { validationResult } = require('express-validator');

	- Validar el ROLE contra la DB
		- Validar el rol que envian en la POST request contra la info de la DB.
			- Creamos una nueva coleccion:
				- MongoDB Compass > cafeDB > Create Collection > Set name > Create Collection
				- En la collection creada: Creamos directo desde Mongo Compass:
					- Add Data > Insert Document > Creamos com JSON > create
			- Creamos un nuevo Model:    role.model.db.js
				- Como lo creamos primero desde MongoDb Compass ahora le damos el Schema con la  key  que le dimos al crearlo. Luego lo estructuramos como queremos, pero ya no haria falta un  .save()  xq los document (objects) ya los creamos con mongo compass.
				- Remember:  En el   model('name'. nameSchema)
				  - name: Debe estar en Singular, porque en mongo lo guarda en plural
					- Por eso en mogo compass guardamos la collection directo en plural
		- Lo validamos con el  check()  en el Route. Pero lo hacemos como  .custom()
				- Aqui el   hrow new Error   NO va a romper la app xq lo va a manejar el
				  .custom(). Asi:  
			check('role').custom(async (role = '') => {
				const roleExist = await Role.findOne({ role });
				if (!roleExist) throw new Error(`The role ${role} is not valid in DB.`);
			}),
			
		- NO enviar el password:
			- En el   user.model.db.js   xq tiene el  Schema:
				- Vamos a hacer uso de un f(x) normal para poder utilizar  this
					- Modificamos el   .methods.toJSON    del Schema creado
					- .toObject() es un method de Mongoose q transforma algo en 1 Obj de JS.  
					- Descruturamos y solo retornamos lo que nos interesa.
								UserSchema.methods.toJSON = function () {
									const { __v, password, ...dataUser } = this.toObject();
									return dataUser;
								};

	- Custom validation - EmailExist?: Como el ejemplo anterior, pero aqui es tarea
		- Cortamos el code del controller, lo pasamos a un f(x) del helper
		- Esa f(x) lo utilizamos en el Route como un  custom
    - Esto para tener el codigo mas limpio y ordenado

	- PUT: Actualizar información del usuario
    - Destructuring los datos que NO quiero que el user pueda modificar, y los que si les hago un  rest  (...)   para que se agrupen.
					const { _id, password, google, mail, ...restData } = req.body;
		- A ese  rest  lo modifico/update en base al ID dinamico que recibo con el method de mongoose:   .findByIdAndUpdate(id, dataToUpdate);
					await User.findByIdAndUpdate(id, restData);

	- Validaciones adicionales en el PUT:
	  - Creo en Arr de Middlewares en el  Route
		  - Al Final de cada Arr de Middlewares en cada  endpoind  del route colocar el  middleware eprsonalizado   validateFields   q creamos para q el express-validator  capte los  err  y los almacene en el  validationResult, para que asi podamos enviarlos en formato JSON y no se rompa la app ante un error.
			- Challenge to myself: Solo el Admin pueda cambiar el   role   de cada user.

	- GET: Obtener todos los User con una Paginacion
	  - Los querys los recuperamos con el destructuring del   req.query
			- rute?something&moreThings 
				? <- para el primer query
				& <- para el resto de querys
	  - Implemento la paginacion con un methods de mongoose. Debemos establecer el 
			from   y el    limit.
				.find()  <-  Devuelve toda la data 
				.find().skip().limit()	<-  skip - desde   |   limit - hasta
	  - Devemos validar que sea un numero

	- Retornar número total de registros en una colección
	  - Para obtener el #total: User.countDocuments({ state: true })
				- .countDocuments()		<--		Devuelve el #total
				- { state: true } <--  Object para contar solo esos, key del Document db
	  - No vamos a eliminar useres de la db, sino q vamos a cambiar su  state  a false.
		- Para que sea mas eficiente debemos hacer un  Primise.all([P_1, P_2, P_n])
		  - Destructuramos los resultados del Promise.all en el Mismo Orden en el que colocamos en el Arr. Destructuring de un Arr q es lo q devuelve esto.
			- Esto ejecuta las promises en paralelo. Hacemos esto cuando una primise NO depende el resultado de la otra promise.
						const [total, users] = await Promise.all([
							User.countDocuments(activeUsers),
							User.find(activeUsers)
								.skip(+from)
								.limit(+limit),
						]);

	- Delete: Borrando un usuario de la base de datos
	  - Ensena 2 formas, cambiando el   state   y borrandolo fisicamente de la db
		  - 1. Cambiando el   state   del document
			  - Para cualquiera q este usando mi servicio REST el user ha sido eliminado, pero para mi, en mi DB, aun lo tengo xq solo se cambio el state.
					await User.findByIdAndUpdate(id, { state: false })  <- state changed
			- 2. Borrar fisicamente:
			 - await User.findByIdAndDelete(id)  <- SI elimina el user de la DB

	- Desplgar REST Server en Heroku
		- No vamos a poder consumir la API desplegada por algo de seguridad. Toca esperar a terminar la S10 para que funcione.
		- Actualizar el repo en GitHub y actualizar en Heroku, como en la S8

	- Variables de entorno personalizadas Heroku
	  - Haciendo esto ya funciono el REST Server desde heroku
	  - No subir el  .env  a GitHub 
			- Dejar de darle seguimiento en Git
						git rm .env --cached
						git add .
						git commit .....

			- Creamos un archivo q si se vaya a subir:  .example.env
			  - Suele tener solo la key de lo que deberia tener
			- Ahora, en Heroku debemos configurar las variables de entorno:
			  - Desde el dashboard: 
				  - deployed > setting > Cnofig Vars > Ponemos la kew y el value
				- Desplegar nuevamenete el proyecto
				  deployed > Deploy > Deploy Branch

			- Desde el CLI de Heroku
				- Subir el proyecto a Heroku
					- Configurar el  package.json  <--  "start": "node app.js"
					- Vamos a https://dashboard.heroku.com/apps > New > New App > Name > Create App > Heroku CLI
						- En el directorio de la app a desplegar:
									heroku login
									heroku git:remote -a nameApp
									git push heroku brachName
				- Establecer las variables de entonrno en Heroku
				  - En el directorio de la app
						- Ver las variables de entorno:    heroku config
						- Crear 1:			heroku config:set key='value'
						- Eliminar 1:		heroku config:unset key
						- Si cambio algo, volvemos a subir a github y a heroku
									git push heroku brachName	
 */
/* 
	
	
	
	
	
	
	
	
*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S8: REST Server
 * Iniciando nuestro proyecto REST Server
	- Nos permiten enviar informacion a travez de endpoints en formato JSON.
	- Instalaciones necesarias:    npm i express dotenv 
	- Vamos a trabajar Express con Classes
	
 * Express basado en Classes
	- Un   ENDPOINT   es una ROUTE
	- Con Express:
		- res.status(#)  		<-  para enviar el status
		- res.json(object)	<- Para enviar data en formato JSON

	- HTTP request method:
		- CRUD:	
			- CREATE		-			POST
			- READ			-			GET
			- UPDATE		-			PUT
			- DELETE		-			DELETE

	- HTTP Status Code: Nuestros servicios siempre deben retornar un Response Code.
		- Ver el PDF

	- Usar Response Code con Express:
		- Las que tienen que ver con:
			- 200		<-		Successful
			- 300		<-		Rederiction
			- 400		<-		Client Error		<-	It's the frontend's fault
			- 500		<-		Server Error		<-	Resolver el Backend author

	- CORS - Middleware:     npm i cors
		- Nos permite proteger nuestro server de una manera superficial.
			- Podemos restringir las peticiones a ciertas urls, creando whitelist, etc.
		- Siempre se debe configurar el cors.
	
	- Separar las rutas y el controlador de la Class
		- Lo establecemos desde del Server como middleware, pero especificando la ruta.
			- Para que sea mas ordenado guardamos el path en el constructor

				- Routes:
					- Ya colocar su route especifico, sino que colocar un  '/'
					- Al route especifico lo establecemos en el Server

				- Controllers:
	
	- Recibir informacion:Con el Middleware:     this.app.use(express.json());
			- La obtenemos en el Controller del   req.body
			- Lo normal es destructurar lo que necesitamos para no utilizar otra cosa q nos puedan enviar. <- Pequena validacion inicial

	- Parametros de segmento y query: Son los parametros que pasamos a la url
		- Parametros de segmento Dinamicos	<-	/:id 
			- Lo recuperamos en el codigo con:  req.params.paramNameDinamico
					const id = req.params.id
		- Query Params: Los que se pasan con   ?   en la url en un GET
			- Los recuperamos con:   req.query
				- Es conveniente hacer una Destructuring para poder establecer valores por default en caso de que no me pasen.
	
	- Desplegar nuestro REST Server a produccion
		- Establecer el script   "start": "node app.js"		en el package.json
		- Subirlo a GitHub > Vincularlo a Heroku
		- Provar la API con Postman del REST Server en produccion 

	- Pro Tip: Ambiente de producción y desarrollo en Postman:
		- Nos permite generar variables de entorno
			- Para utilizar el mismo TAB y trabajar con la API en produccion y en development
				- Enviroment > Agregar > name > url inicial > ctrl + s
				- Con esto en el TAB abierto utilizo el enviroment:
						{{name}}/api/users
								- Pero solo va a funcionar si seleccionamos en Envirment de la
									parte superior derech. Asi cambiamos, seleccionando y tal
 */
