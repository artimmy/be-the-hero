const connection = require('../database/connection');

module.exports = {

    //lista todos os casos limite de 5 
    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') 
        .limit(5)
        .offset((page - 1)* 5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf']);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    //cria um novo caso 
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });
        return response.json({ id });
    },

    //deleta um caso 
    async delete(request, response) {
        //recebe o id do caso que ele quer deletar mais o id dessa ong
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        
        //seleciona o incidente pelo id da ong
        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        // compara se o id dele e o mesmo do registro
        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.'});
        }
        // deleta
        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};