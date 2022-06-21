import fs from 'fs';

const contents = fs.readFileSync('./db/Chinook_Sqlite.sql', { encoding: 'utf8' });
//const contents = fs.readFileSync('./db/temp.sql', { encoding: 'utf8' });

const newContents = contents.replace(
  /'([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})'/g,
  (_match, p1) => {
    return new Date(p1).getTime();
  },
);

console.log(newContents);
