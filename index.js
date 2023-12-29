import express from 'express';
import bodyParser from 'body-parser';
import connection from './database/database.js';
import Pergunta from './database/models/Pergunta.js'
import Resposta from './database/models/Resposta.js';



//database - authenticate faz a conexao
connection.authenticate().then(() => {
    console.log('Conectado com o banco de dados!');
}).catch((error) => {
    console.log(error);
});

const app = express();


app.use(express.static('public'));
//definir o uso do express para o EJS como view engine
app.set('view engine', 'ejs');
//decodifica os dados enviados pelo formulario
app.use(bodyParser.urlencoded({extended: false}));
//ler dados de formulario enviados via json
app.use(bodyParser.json());
app.get('/', (req, res) => {
    //para ordenar utilizar array dentro de array e passar os parametros para ordenacao
    Pergunta.findAll({raw : true, order: [['id', 'DESC']]}).then(perguntas => {//DESC = decrescente || ASC = crescente
        console.log(perguntas);
        res.render('index', {
            perguntas : perguntas
        });
    });
    
});





//pagina da pergunta
app.get('/pergunta/:id',(req, res) => {
    let id = req.params.id;
    Pergunta.findOne({
        where:{id:id}//faz a busca onde o parametro passado seja igual o valor procurado
    }).then(pergunta => {
        
        if(pergunta != undefined){
            Resposta.findAll({
                where:{perguntaId:pergunta.id},
                order: [['createdAt', 'DESC']]
            }).then(respostas =>{
                res.render("pergunta", {
                    pergunta : pergunta,
                    respostas:respostas
                });
            });

        }else{
            console.log()
            res.redirect('/')
        };
    });
});

app.post('/responder', (req,res) => {
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId : perguntaId
    }).then(() => {[
        res.redirect("/pergunta/" + perguntaId)
    ]})

})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
});

app.post('/salvarpergunta', (req,res) => { 
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    //CREATE = INSERT INTO 'TABELA'
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});
app.get('/:nome?/:lang?', (req,res) => {
    //passando variaveis para o HTML com EJS
    const nome = req.params.nome
    const lang = req.params.lang
    const msg_erro = false;
    //for each com produtos
    const produtos = [
        {nome: 'Notebook', preco: 2499.90},
        {nome: 'Tablet', preco: 1299.90},
        {nome: 'Mouse', preco: 59.90},
        {nome: 'Teclado', preco: 29.90},
        {nome: 'Monitor', preco: 149.90},
    ]
    res.render('index', {
        nome : nome,
        lang: lang,
        idade : '27',
        msg : msg_erro,
        produtos: produtos
    });
});

app.listen(8080, ()=>{
    console.log('Servidor rodando na porta 8080');
});