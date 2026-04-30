INSERT INTO editorial (nombre) VALUES
('Planeta'),
('Penguin Random House'),
('HarperCollins'),
('Anagrama'),
('Alfaguara');

INSERT INTO genero (nombre, descripcion) VALUES
('Ficción', 'Narrativa ficticia'),
('Ciencia Ficción', 'Tecnología y futuro'),
('Fantasía', 'Mundos mágicos'),
('Romance', 'Historias de amor'),
('Misterio', 'Suspenso e intriga'),
('Historia', 'Eventos históricos'),
('Tecnología', 'Libros técnicos');

INSERT INTO autor (nombre) VALUES
('Gabriel García Márquez'),
('J.K. Rowling'),
('George Orwell'),
('Isaac Asimov'),
('J.R.R. Tolkien'),
('Dan Brown'),
('Yuval Noah Harari'),
('Stephen King'),
('Julio Verne'),
('Jane Austen');

INSERT INTO libro (titulo, isbn, descripcion, precio, formato, stock, id_editorial, fecha_publicacion, numero_paginas, imagen) VALUES
('Cien años de soledad', 'ISBN001', 'Realismo mágico', 15990, 'fisico', 10, 1, '1967-01-01', 417, 'url1'),
('Harry Potter y la piedra filosofal', 'ISBN002', 'Magia y aventura', 19990, 'fisico', 15, 2, '1997-06-26', 309, 'url2'),
('1984', 'ISBN003', 'Distopía', 12990, 'fisico', 8, 3, '1949-06-08', 328, 'url3'),
('Fundación', 'ISBN004', 'Ciencia ficción clásica', 14990, 'fisico', 12, 3, '1951-01-01', 255, 'url4'),
('El señor de los anillos', 'ISBN005', 'Fantasía épica', 25990, 'fisico', 5, 2, '1954-07-29', 1178, 'url5'),
('El código Da Vinci', 'ISBN006', 'Misterio religioso', 17990, 'fisico', 7, 1, '2003-03-18', 689, 'url6'),
('Sapiens', 'ISBN007', 'Historia de la humanidad', 18990, 'fisico', 20, 5, '2011-01-01', 443, 'url7'),
('It', 'ISBN008', 'Terror', 16990, 'fisico', 6, 2, '1986-09-15', 1138, 'url8'),
('Viaje al centro de la Tierra', 'ISBN009', 'Aventura científica', 11990, 'fisico', 9, 4, '1864-01-01', 183, 'url9'),
('Orgullo y prejuicio', 'ISBN010', 'Romance clásico', 10990, 'fisico', 11, 4, '1813-01-28', 279, 'url10');

INSERT INTO libro_autor (id_libro, id_autor) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

