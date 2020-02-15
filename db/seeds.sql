use users_db;

INSERT INTO users (username, email, password, photo, location) 
VALUES ('russomp', 'russomp@github.com', '1234', 'https://rachelcorbett.com.au/wp-content/uploads/2017/08/Drawing-of-man-playing-music-on-a-guitar.jpg', 'New-York'),
       ('rooster', 'therooster@gmail.com', '5678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRpijNVVjDlJPJBs1MSj9Ej4JTywob-y1HcXesDCDztOWjxlNom', 'New-York, Manhattan'),
       ('test', 'test@gmail.com', '654321', 'https://images.theconversation.com/files/293633/original/file-20190923-54813-1w4rvgc.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip', 'New-York, Brooklyn')

INSERT INTO authors (name) 
VALUES ('The Beatles'),
       ('The Rolling Stones'),
       ('Queen'),
       ('AC/DC'),
       ('U2'),
       ('Metallica')

