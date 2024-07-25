//express import
const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const connection = require('./database/database.js')
const Pergunta = require('./database/Pergunta.js')
const { where } = require("sequelize")
const Resposta = require("./database/Resposta.js")

//connection database
connection
    .authenticate()
    .then(()=>{
        console.log("Connection with database done...")
    })
    .catch((msgErro)=>{
        console.log(msgErro)
    })

//using ejs with view engine
app.set('view engine', 'ejs')
//using static file
app.use(express.static('public'))
//using body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then((perguntas)=>{
        res.render("index",{
            perguntas: perguntas
        })
    })
})

app.get("/perguntar", (req, res)=>{
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res)=>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao 

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res)=>{
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta)=>{
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                raw: true,
                order:[['id','DESC']]
            }).then((respostas)=>{

                res.render('pergunta',{
                    pergunta: pergunta,
                    respostas: respostas
                })
            })

        }else{
            res.redirect('/')
        }
    })
})

app.post("/responder",(req, res)=>{
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    })
})

//Starting server
app.listen(5050,(erro)=>{
    if(erro)
        console.log(erro)
    else
        console.log("App Running")
})