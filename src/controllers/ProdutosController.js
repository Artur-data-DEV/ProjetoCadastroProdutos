//const Product = require("../models/Product");
import * as Yup from 'yup';
import Produtos from "../models/Produtos.js";

class ProdutosController {
    // GET /products > Listar produtos
    // errors code: 100..109
    // ?page=1&limit=10
    async list(req, res) {
        // consultar no banco os produtos
        const limit = req.query.limit || 3;
        const page = req.query.page || 1;

        Produtos.paginate({}, {page, limit}).then((produtos) => {
            return res.json({
                error: false,
                produtos: produtos
            });
        }).catch(() => {
            return res.status(400).json({
                error: true,
                code: 100,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
        }
    // GET /products/:id > Listar um produto
    // errors code: 110..119
    async listOne(req, res) {
        Produtos.findOne({ _id: req.params.id }, '_id nome marca categoria createAt updateAt').then((Produtos) => {
            return res.json({
                error: false,
                Produtos: Produtos
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 110,
                message: "Erro: Não foi possível executar a solicitação!"
            })
        })
    }
    // POST /products
    // errors code: 120..129
    async create(req, res) {
        // Validação com Yup
        const schema = Yup.object().shape({
            nome: Yup.string()
                .required(),
            marca: Yup.string()
            .required(),
            categoria: Yup.string()
                .required()
        });
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 120,
                message: err.message
            });
        }
        
        Produtos.create(req.body).then((produtos) => {
            return res.json({
                error: false,
                message: "Produto cadastrado com sucesso!",
                produtos
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 122,
                message: "Error: produto não foi cadastrado com sucesso"
            });
        });
    }
    // PUT /products/:id
    // errors code: 130..139
    async update(req, res) {
        // Validação com Yup
        const schema = Yup.object().shape({
            nome: Yup.string()
                .notOneOf(['']),
            marca: Yup.string()
                .notOneOf(['']),
            categoria: Yup.string()
                .notOneOf([''])
        });
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 130,
                message: err.message
            });
        }
        
        try {
            //caso a string não obtiver o comprimento adequado para o ID (catch)
            const produtoExiste = await Produtos.findOne({_id: req.params.id});
            if(!produtoExiste){
                return res.status(400).json({
                    error: true,
                    code: 132,
                    message: "Erro: produto não encontrado!"
                });
            };
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: produto não encontrado!"
            });
        }
        

        

        Produtos.updateOne({_id: req.params.id}, req.body).then(() => {
            return res.json({
                error: false,
                message: "produto editado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 133,
                message: "Erro: produto não foi editado com sucesso!"
            });
        });
    }
    // DELETE /products/:id
    // errors code: 140..149
    async delete(req, res) {

        try {
            //caso a string não obtiver o comprimento adequado para o ID (catch)
            const produtoExiste = await Produtos.findOne({_id: req.params.id});
            if(!produtoExiste){
                return res.status(400).json({
                    error: true,
                    code: 140,
                    message: "Erro: produto não encontrado!"
                });
            };
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 141,
                message: "Erro: produto não encontrado!"
            });
        }

        Produtos.deleteOne({ _id: req.params.id }).then(() => {
            return res.json({
                error: false,
                message: "Produto apagado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 142,
                message: "Error: produto não foi apagado com sucesso!"
            });
        });
    }
}

//module.exports = new ProdutosController();
export default new ProdutosController();