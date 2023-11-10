-- create schema nodeQuery

/* Registro do paciente */
create table nodeQuery.patient (
    idP int identity(1,1) primary key,
    nome varchar(20)not null,
    sobrenome varchar(30) null,
    email varchar(50) unique not null,
    cpf char(11) unique not null,
    nickname varchar(20) unique not null,
    senha varchar(200) not null
);
/* Fim do registro do paciente */


/* Tipo de médico (oftalmologista, dentista, etc) */
create table nodeQuery.typeDoctor (
    idType int identity(1,1) primary key,
    nome varchar(30) not null
);
/* Fim do tipo de médico */


/* Registro de médico */
create table nodequery.doctor (
    idm int identity(100, 1),
    nome varchar(20) not null,
    sobrenome varchar(30) null,
    crm varchar(5) not null,
    idtype int not null,
    email varchar(50) unique not null,
    senha varchar(200) not null,
    primary key (idm, idtype),
    foreign key (idtype) references nodequery.typedoctor(idtype)
);
/* Fim do registro do médico */


/* Tipo da consulta */
create table nodeQuery.typeQuery (
    idTypeQ int identity(1,1) primary key,
    nome varchar(30) not null
);
/* Fim do tipo da consulta */


/* Status da consulta */
create table nodeQuery.statusQuery (
    idStatusQ int identity(1,1) primary key,
    nome varchar(50) not null
);
/* Fim do status da consulta */


/* Registro de consulta */
create table nodeQuery.query (
    idC int identity(1,1) primary key,
    dadosConsulta datetime,
    idM int,
	idType int,
    idP int,
    idTypeQ int,
    idStatusQ int,
    foreign key (idM, idType) references nodeQuery.doctor(idM, idType),
    foreign key (idP) references nodeQuery.patient(idP),
    foreign key (idTypeQ) references nodeQuery.typeQuery(idTypeQ),
    foreign key (idStatusQ) references nodeQuery.statusQuery(idStatusQ)
);
/* Fim do registro de consulta */


/* Login */
create table nodeQuery.acess (
    idLogin int identity(1,1) primary key,
    usuario varchar(50),
    senha varchar(200),
	typeUser varchar (8), 
    dataAcess datetime default getdate()
);
/* Fim do login */


select * from nodeQuery.patient
select * from nodeQuery.typeDoctor
select * from nodeQuery.doctor
select * from nodeQuery.typeQuery
select * from nodeQuery.statusQuery
select idC, CONVERT(NVARCHAR, dadosConsulta, 103) + ' - ' + CONVERT(NVARCHAR, dadosConsulta, 108) as dadosConsulta, idM, idType, idP, idTypeQ, idStatusQ from nodeQuery.query
SELECT idLogin, usuario, senha, typeUser,CONVERT(NVARCHAR, dataAcess, 103) + ' - ' + CONVERT(NVARCHAR, dataAcess, 108) AS dataAcess FROM nodeQuery.acess

drop table nodeQuery.patient
drop table nodeQuery.typeDoctor	
drop table nodeQuery.doctor
drop table nodeQuery.typeQuery
drop table nodeQuery.statusQuery
drop table nodeQuery.query
drop table nodeQuery.acess

SELECT table_name FROM information_schema.tables WHERE table_schema = 'nodeQuery'