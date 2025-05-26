const pool = require('../config/db'); // Assume you have a db connection like in ubsController
const bcrypt = require('bcrypt'); // Assuming bcrypt is used for password hashing

exports.atualizarStatusVacinaMobile = async (req, res) => {
  const { ubsId, vacinaId: vacinaNome } = req.params; // Get ubsId and vacinaName from params
  const { status, cpf_funcionario } = req.body; // Pegue o status e cpf_funcionario do corpo

  // Limpar o CPF removendo caracteres não numéricos
  const cleanedCpf = cpf_funcionario.replace(/\D/g, ''); // Remove all non-digit characters

  console.log(`Requisição para atualizar vacina no mobile recebida:`);
  console.log(`UBS ID: ${ubsId}`);
  console.log(`Vacina Nome: ${vacinaNome}`); // Log the vaccine name
  console.log(`Novo Status: ${status}`);
  console.log(`CPF Funcionário: ${cpf_funcionario} (limpo: ${cleanedCpf})`); // Log do CPF também

  try {
    // --- Lógica de atualização do banco de dados adaptada ---

    // Primeiro verifica se a UBS existe
    const ubsResult = await pool.query('SELECT id FROM ubs WHERE id = $1', [ubsId]);
    if (ubsResult.rows.length === 0) {
      return res.status(404).json({ error: 'UBS não encontrada' });
    }
    const ubsExist = ubsResult.rows[0].id; // Store UBS ID

    // *** Buscar o ID numérico da vacina pelo nome ***
    const vacinaResult = await pool.query('SELECT id FROM vacinas WHERE nome = $1', [vacinaNome]); // Search by name
    if (vacinaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacina não encontrada pelo nome' }); // More specific error
    }
    const vacinaId = vacinaResult.rows[0].id; // Get the numeric vaccine ID

    // --- Temporariamente removida a busca e validação do funcionário para teste mobile ---
    // Busca o funcionário pelo CPF
    // Use o CPF limpo para a consulta no banco de dados
    // const funcionarioResult = await pool.query('SELECT id FROM funcionarios WHERE cpf = $1', [cleanedCpf]); // Use cleanedCpf
    // if (funcionarioResult.rows.length === 0) {
    //   return res.status(404).json({ error: 'Funcionário não encontrado' });
    // }
    // const funcionarioId = funcionarioResult.rows[0].id; // Get funcionario ID
    // -------------------------------------------------------------------------------------

    // Busca o status atual da vacina (opcional, mas útil para histórico)
    const statusAtualResult = await pool.query(`
      SELECT status 
      FROM disponibilidade_vacinas 
      WHERE id_ubs = $1 AND id_vacina = $2
    `, [ubsId, vacinaId]); // Use numeric vacinaId here

    const statusAnterior = statusAtualResult.rows.length > 0 ? statusAtualResult.rows[0].status : null;

    // Atualiza ou insere o status da vacina
    const result = await pool.query(`
      INSERT INTO disponibilidade_vacinas (id_ubs, id_vacina, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_ubs, id_vacina) 
      DO UPDATE SET status = $3
      RETURNING *
    `, [ubsId, vacinaId, status]); // Use numeric vacinaId here

    // --- Temporariamente removido o registro no histórico para teste mobile ---
    // Registra a alteração no histórico
    // await pool.query(`
    //   INSERT INTO historico_atualizacoes (
    //     id_funcionario,
    //     id_ubs,
    //     id_vacina,
    //     status_anterior,
    //     status_atual,
    //     data,
    //     hora
    //   ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_TIME)
    // `, [
    //   funcionarioId, // Use o ID do funcionário encontrado
    //   ubsId,
    //   vacinaId, // Use numeric vacinaId here
    //   statusAnterior || 'Indisponível',
    //   status // Use status from body
    // ]);
    // -------------------------------------------------------------------------

    // Resposta de sucesso
    res.status(200).json({ message: 'Status da vacina atualizado com sucesso (mobile)' });

  } catch (error) {
    console.error('Erro ao atualizar vacina no mobile:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar vacina' }); // Send error message in the response
  }
};

// --- Novo endpoint de login para mobile ---
exports.loginMobile = async (req, res) => {
  const { cpf, senha } = req.body;

  // Limpar o CPF recebido removendo caracteres não numéricos
  const cleanedCpfInput = cpf.replace(/\D/g, ''); // Remove all non-digit characters from input

  try {
    // Busca o funcionário no banco, comparando o CPF limpo da entrada com o CPF limpo do BD
    const funcionarioResult = await pool.query(
      `SELECT f.*, ubs.nome as nome_ubs 
       FROM funcionarios f 
       LEFT JOIN ubs ON f.id_ubs = ubs.id 
       WHERE REGEXP_REPLACE(f.cpf, '[^0-9]', '', 'g') = $1`,
      [cleanedCpfInput] // Use o CPF limpo da entrada aqui
    );

    // Se não encontrou o funcionário
    if (funcionarioResult.rows.length === 0) {
      return res.status(401).json({ error: 'CPF ou senha incorretos' });
    }

    const funcionario = funcionarioResult.rows[0];

    // Verifica a senha baseado no tipo de acesso (lógica copiada de authController)
    if (funcionario.primeiro_acesso) {
      // Se for primeiro acesso, compara diretamente
      if (senha !== funcionario.senha) {
        return res.status(401).json({ error: 'CPF ou senha incorretos' });
      }
    } else {
      // Se não for primeiro acesso, compara usando bcrypt
      // Nota: Se suas senhas de primeiro acesso não são hashed, bcrypt.compare falhará nelas.
      // A lógica do authController lida com isso. Adaptando aqui.
      const senhaValida = await bcrypt.compare(senha, funcionario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'CPF ou senha incorretos' });
      }
    }

    // Retorna os dados do funcionário (adaptado de authController)
    res.json({
      primeiro_acesso: funcionario.primeiro_acesso,
      user: {
        cpf: funcionario.cpf,
        nome: funcionario.nome,
        id_ubs: funcionario.id_ubs,
        nome_ubs: funcionario.nome_ubs
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login mobile:', error); // Log mais específico
    res.status(500).json({ error: 'Erro ao fazer login mobile' });
  }
}; 