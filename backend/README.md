# Libreria backend

Esta libreria tiene como funcion, proveer al backend de la aplicacion con su respectiva API utilizando Django REST Framework, y Reportlab, Matplotlib para realizar la generacion de imagenes y de pdfs solicitados a la API.

## Django REST Framework

Todos los modulos son utilizados por la API al momento de correr el servidor, sin embargo, los designados para el manejo de solicitudes y la base de datos son: models.py, permissions.py, serializers.py, urls.py, views.py y email.py

### models.py

En este modulo se encuentran los modelos utilizados en la base de datos, a traves del ORM (object relational mapper) de django.
Cada clase en este modulo representa una tabla en la base de datos, y cada variable en cada clase representa una columna en cada tabla.
Entre los posibles campos de cada columna se encuentran: 

- CharField y TextField los cuales permiten manejo de texto en una columna.
- IntegerField, el cual permite el manejo de numeros enteros en una columna.
- DateField el cual permite permite el manejo de fechas en una columna.
- ForeignKey, el cual permite acceso a una fila de otra tabla.
- ImageField, la cual permite contener direcciones a una image almacenada en la carpeta 'media' (ver settings.py en la carpeta v_website)
- BooleanField, permite almacenar valores True/False
- DecimalField, permite almacenar numeros decimales.

Cada una de estos campos o fields con sus propias propiedades como por ejemplo TextField, el cual cuenta con una propiedad 'max_length', la cual establece un numero maximo de caracteres por celda en la base de datos. Sin embargo, la mayoria de estas propiedades cuenta con un nombre bien definido que describe su funcionalidad. En caso de no reconocer alguno de estos, consultar la [documentacion de los modelos de Django.](https://docs.djangoproject.com/en/3.0/ref/models/fields/)

### permissions.py

En esta carpeta se encuentran las classes que conceden permiso para el acceso a un endpoint dadas ciertas condiciones. Cada una de estas clases es utilizada en las clases que se encuentran en views.py en las variables 'permissions_classes' de cada una de las views. Las 'permission' clases realizan 'inheritance' de la clase 'BasePermission', y establecen si un usuario tiene permiso para acceder a un endpoint a traves del metodo 'has_permission', el cual devuelve un valor True o False en los casos que se tiene y no se tiene permiso correspondientemente.

### serializer.py

Las clases contenidas en este modulo estan encargadas de convertir los valores de la solicitud a un formato que la base de datos pueda interpretar y viceversa. En estas, se define una subclase Meta, la cual contiene el modelo correspondiente y las columnas a las cual tiene acceso el serializer. Por lo general se define fields = '__all__' para tener acceso a todas las columnas. Sin embargo, se puede establecer una lista de las columnas deseadas.
En el caso de incluir ForeignKey, estas columnas deben establecerse como variables que contienen los serializers de la tabla a la cual apunta la ForeignKey.
Al igual que las fields en models.py los serializer pueden tomar argumentos que definen el comportamiento de la API. Por ejemplo, el argumento 'required', define si una columna es requerida a la hora de hacer una solicitud a la API. Para mas informacion consultar la [documentacion de Django REST Framework](https://www.django-rest-framework.org/api-guide/serializers/)

### email.py

En este modulo se encuentra la funcion send_email, la cual esta encargada de enviar diferentes tipos de correos a usuarios.

### views.py

En este modulo se define el comportamiento que tendra cada enpoint basado en los metodos definidos en cada view. por lo general, para cada una de las views (a excepcion de las de autenticacion), se define el metodo 'get_queryset', el cual es utilizado para extraer la informacion deseada de la base de datos (que cada usuario define en los parametros de la solicitud). Sin embargo, cada view tambien limita lo que cada usuario puede ver. Si el usuario no es interno de la empresa, este solo podra ver informacion correspondiente a su empresa. La view realiza esto utilizando lo que se denominan Q objects, los cuales permiten realizar multiples filtros a una tabla a la misma vez.

### urls.py

En este modulo se registran todos los enpoints que soporta la API. Algunos a traves de la clase routers, y otros haciendo usos de la funcion path.
Cabe notar que por lo general todos los enpoints utilizados por la clase routers aceptan solicitudes de multiples metodos (PUT, PATCH, DELETE, POST y GET), mientras que los que utilizan la funcion path aceptan solo uno por lo general.


## Reportlab

Con el fin de realizar los pdfs de predictivos, y de otros informes, la libreria reportlab permite la creacion de estos de una manera sencilla. Para este fin, se utilizan los modulos: graph.py, flowables.py, segment.py y report.py. 

En la libreria reportlab, se utilizan lo que se conocen como flowables, los cuales representan cualquier elemento que se pueda insertar en un documento (parrafos, imagenes, imagenes entre otros). Estos son insertados la variable llamada story, la cual determina el orden de los flowables en el documento. Cabe aclarar que los flowables insertados en la 'story' estaran restringidos a la 'Frame' de la 'Template' que el documento este manejando en ese momento. Una Frame establece un rectangulo adrentro del cual se pueden insertar flowables. Sin embargo es posible adicionar flowables afuera de las Frames al utilizar metodos que definan en que parte la template (cordenadas X y Y) se desean adicionar flowables. De esta manera se pueden agregar encabezados y pie de pagina para diferentes templates. Reportlab es una libreria muy extensa, por lo tanto, se recomiendo revisar la [documentacion de esta.](https://www.reportlab.com/docs/reportlab-userguide.pdf)

### flowables.py

En este modulo, se encuentran cada uno de los flowables utilizados para la generacion de cada una de las partes de documento. El pdf cuenta con muchos segmentos, por lo tanto exiten muchos mas flowables. Sin embargo la mayoria de estos son parrafos, tablas, imagenes entre otros.

### graph.py

Este modulo se encarga de generar los graficos utilizados en el pdf. Este hace uso de los modelos establecidos en models.py para consumir la informacion que reside en la base de datos.

Entre los graficos que este genera, estan tendencias, cascadas, señal en el tiempo y tablas.

### segment.py

En este modulo se encuentran los metodos encargados de generar los segmentos del documento. Entre estos, se encuentra la carta informe (letter_one), carta configuracion predictivo (letter_two), informe resumen (summary), norma iso (ISO) y el metodo para la creacion de predictivos (create_pred). Cada uno de estos metodos define la logica para agregar los flowables correspondientes de su segmento a la 'story'.

### report.py

Este modulo se encarga de las funciones de mas alto nivel. Entre estas, se encarga de llamar las funciones en segment.py en orden correspondiente, es decir, definir el orden de los segmentos del documento. Ademas, en esta clase se define el metodo afterFlowable, el cual determina las entradas a la tabla de contenido.