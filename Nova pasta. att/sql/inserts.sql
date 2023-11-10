insert into nodeQuery.patient values
	('Lucas', 'Cardoso', 'luquinhass@gmail.com', '12345678910', 'ben10', 'lulucas123'),
	('Ana', 'Silva', 'aninha@gmail.com', '12345678911', 'aniha12', 'anasenha321'),
	('Pedro', 'Alves', 'pedroa@gmail.com', '12345678912', 'pedroa13', 'pedropwd456'),
	('Carla', 'Oliveira', 'carlao@gmail.com', '12345678913', 'carla14', 'carlasecret789'),
	('Bruno', 'Costa', 'brunoc@gmail.com', '12345678914', 'bruno15', 'brunopass123'),
	('Julia', 'Santos', 'julias@gmail.com', '12345678915', 'julias16', 'juliaspwd456'),
	('Roberto', 'Barbosa', 'robertob@gmail.com', '12345678916', 'roberto17', 'roberto7890')

insert into nodeQuery.typeDoctor values
	('Cardiologista'),
	('Dermatologista'),
	('Ginecologista'),
	('Ortopedista'),
	('Anestesiologista'),
	('Pediatra'),
	('Oftalmologista'),
	('Psiquiatra'),
	('Urologista'),
	('Neurologista'),
	('Radiologista'),
	('Dentista')

insert into nodeQuery.doctor values
	('Lucas', 'Souza', '23514', '1', 'lucas@gmail.com', 'senha123'),
	('Roberto', 'Alves', '23541', '4', 'roberto@gmail.com', 'senha456'),
	('Flávia', 'Andrade', '23506', '3', 'flavia@gmail.com', 'senha789'),
	('Paula', 'Tardim', '23512', '7', 'paula@gmail.com', 'senha1011'),
	('Fernanda', 'Cardoso', '22456', '2', 'fernanda@gmail.com', 'senha1213'),
	('Alex', 'Lopez', '22315', '8', 'alex@gmail.com', 'senha1415'),
	('Guilherme', 'Silva', '23437', '12', 'guilherme@gmail.com', 'senha1617');


insert into nodeQuery.typeQuery values
	('Primeira vez'),
	('Frequente'),
	('Retorno')

insert into nodeQuery.statusQuery values
	('Concluída'),
	('Cancelada'),
	('Agendada'),
	('Reagendada'),
	('Não compareceu')

insert into nodeQuery.query values
	('2024-05-10 15:00', '106', '12', '5', '2', '4'),
	('2023-11-01 14:00', '104', '2', '1', '2', '2'),
	('2023-11-03 10:00', '101', '4', '3', '1', '3')

select idC, CONVERT(NVARCHAR, dadosConsulta, 103) + ' - ' + CONVERT(NVARCHAR, dadosConsulta, 108) as dadosConsulta, idM, idType, idP, idTypeQ, idStatusQ from nodeQuery.query
