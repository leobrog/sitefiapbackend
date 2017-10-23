// Aqui estamos usando os pacotes instalados para o arquivo:
var express     = require('express');
var app         = express();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt     = require('jsonwebtoken'); //pacote usado para criar e verificar os tokens
var config  = require('./config'); //aqui estamos retornando a configuração criada nesse arquivo relacionado ao bd
var Usuario = require('./app/models/usuario'); //estamos retornando a classe de modelo 'Usuario'
var Content = require('./app/models/content');


var port = process.env.PORT || 8000; //aqui estamos configurando a porta da nossa api. Onde irá: criar e verificar os tokens tbm
mongoose.connect(config.database); //aqui iremos conectar a base de dados
app.set('superNode-auth', config.configName); //variável que criamos no arquivo 'config'

//Aqui estamos usando o 'body-parser' para obter as informações das requisições via POST (parâmetros)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//aqui estamos usando o 'morgan' para criar um log de requisições através do console de qualquer alteração que tivermos em nossa api:
app.use(morgan('dev'));

//Rota Padrão da API:
app.get('/', function(req, res) {
    res.send('Seja Bem-Vindo a API: http://localhost:' + port + '/api');
});

//Aqui estamos obtendo a instância do router para as rotas das APIs:
var apiRoutes = express.Router();

//TODO: Criar a rota: /authenticate: http://localhost:8000/authenticate
apiRoutes.post('/authenticate', function(req, res) {
    
    //Aqui estaremos buscando o usuário
    Usuario.findOne({
    username: req.body.username
  }, function(err, usuario) {

    if (err) throw err;

    if (!usuario) {
      res.json({ success: false, message: 'Autenticação do Usuário falhou. Usuário não encontrado!' });
    } else if (usuario) {

      //Aqui iremos verificar se a password bate com o que está cadastrado no banco:
      if (usuario.password != req.body.password) {
        res.json({ success: false, message: 'Autenticação do Usuário falhou. password incorreta!' });
      } else {

        // caso a password do usuário seja encontrada.... iremos criar um token:
        var token = jwt.sign(usuario, app.get('superNode-auth'), {
          expiresInMinutes: 1440 //o token irá expirar em 24 horas
        });

        //Aqui iremos retornar a informação do token via JSON:
        res.json({
          success: true,
          message: 'Token Criado!',
          token: token
        });
      }   
    }
  });
});


//TODO: Criar a rota middleware para poder verificar e autenticar o token
apiRoutes.use(function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, app.get('superNode-auth'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Falha ao tentar autenticar o token!' });    
            } else {
            //se tudo correr bem, salver a requisição para o uso em outras rotas
            req.decoded = decoded;    
            next();
            }
        });

        } else {
        // se não tiver o token, retornar o erro 403
        return res.status(403).send({ 
            success: false, 
            message: 'Não há token.' 
        });       
    }
});


//Rota para mostrar a mensagem aleatória em: GET http://localhost:8000/api
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Bem-Vindo a Nossa Linda API!!! '});
});

//Rota para retornar todos os usuários: GET: http://localhost:8000/usuarios
apiRoutes.get('/usuarios', function(req, res){
    Usuario.find({}, function(error, usuarios){
        res.json(usuarios);
    });
});

//Rota para fazer post do conteudo editado
apiRoutes.put("/content", function(req, res){
    Content.findById(req.params.content_id, function(error, content){
        if(error) res.send(error);
        
        content.leadspace = req.body.leadspace;
        content.robotSection = req.body.robotSection;
        content.constructionSection = req.body.constructionSection;
        content.competitionSection = req.body.competitionSection;
        content.teamSection = req.body.teamSection;
        
        content.save(function(error) {
            if(error) res.send(error);
            
            res.json({message: 'Conteudo atualizado'});
        });
    });
});

//E aqui iremos aplicar as rotas para a nossa aplicação com o prefixo: /api:
app.use('/api', apiRoutes);

//Demais rotas:
app.get('/create', function(req, res){
    //Aqui iremos criar um usuário de exemplo - todas as vezes que formos usar essa rota aparecerá esse usuário
    var usuarioExemplo = new Usuario({
        username: 'lixoimundo',
        password: 'password123',
        admin: true
    });

    //Aqui estaremos salvando esse usuário de exemplo:
    usuarioExemplo.save(function(error) {
        if(error)
            throw error;

        console.log('Usuário Criado com Sucesso!');
            res.json({
               success: true 
            });
    });
});

app.get('/createcontent', function(req, res){
    //Aqui iremos criar um usuário de exemplo - todas as vezes que formos usar essa rota aparecerá esse usuário
    var conteudo = new Content({
        leadspace: {
            title: 'Tindao doidao',
            subtitle: 'doido memo',
            button: 'clica aqui '
        },
        robotSection: {
            section_title: 'Robo',
            textArea_1: {
                heading: 'qualquecoisa',
                text: 'lalalalalal'  
            },
            textArea_2: {
                heading: 'qualquecoisa',
                text: 'lalalalalal'  
            },
            imgUrl_1: 'url',
            imgUrl_2: 'url',
            imgUrl_3: 'url',
            description_1: 'loquissimo',
            description_2: 'olha soh'
        },
        constructionSection: {
            section_title: 'Construction',
            textArea_1: {
                heading: 'qualquecoisa',
                text: 'lalalalalal'  
            },
            imgUrl_1: 'url',
            imgUrl_2: 'url',
            imgUrl_3: 'url',
            imgUrl_4: 'url',
            imgUrl_5: 'url',
            imgUrl_6: 'url',
            imgUrl_7: 'url',
            imgUrl_8: 'url'
        },
        competitionSection: {
            section_title: 'Competition',
            textArea_1: {
                heading: 'qualquecoisa',
                text: 'lalalalalal'  
            },
            imgUrl_1: 'url'
        },
        teamSection: {
            section_title: 'Team',
            member_1:{
                name: 'membro',
                imgUrl: 'url'
            },
            member_2:{
                name: 'membro',
                imgUrl: 'url'
            },
            member_3:{
                name: 'membro',
                imgUrl: 'url'
            },
            member_4:{
                name: 'membro',
                imgUrl: 'url'
            },
            member_5:{
                name: 'membro',
                imgUrl: 'url'
            }
        }
    });

    //Aqui estaremos salvando esse usuário de exemplo:
    conteudo.save(function(error) {
        if(error)
            throw error;

        console.log('Conteudo criado com Sucesso!');
            res.json({
               success: true 
            });
    });
});

app.get('/content', function(req, res){
    Content.find({}, function(error, content){
        res.json(content);
    });
});

app.put("/content/:id", function(req, res){
    Content.findById(req.params.id, function(error, content){
        if(error) res.send(error);
        
        content = req.body.content;

        
        content.save(function(error) {
            if(error) res.send(error);
            
            res.json({message: 'Conteudo atualizado'});
        });
    });
});

//Iniciamos o server via node server.js
app.listen(port);
console.log('Aplicação sendo executada em http://locahost:' + port);