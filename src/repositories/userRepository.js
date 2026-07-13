async function findAllUsers() {
  const { rows } = await pool.query(`
    SELECT * FROM users;
    `);

  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM users WHERE id=$1;
    `,
    [id],
  );

  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT * FROM users WHERE email=$1;
    `,
    [email],
  );

  return rows[0] || null;
}

async function createUser(data) {
  const { name, password, email, birth_date } = data;
  const { rows } = await pool.query(
    `
        INSERT INTO 
                users(name, password, email, birth_date)
            VALUES
                ($1,$2,$3,$4) 
              RETURNING *
        `,
    [name.trim(), password.trim(), email.trim(), birth_date],
  );

  return rows[0] || null;
}

async function updateUser(id, data) {
  const fields = [];
  const values = [];

  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(typeof value === "string" ? value.trim() : value);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${index}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] ?? null;
}

async function deleteUser(id) {
  const { rows } = await pool.query(
    `
    DELETE FROM users WHERE id = $1 RETURNING *
    `,
    [id],
  );

  return rows[0] ?? null;
}

export {
  createUser,
  findAllUsers,
  findById,
  findByEmail,
  updateUser,
  deleteUser,
};
