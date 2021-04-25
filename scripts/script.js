'use strict';

const h1 = document.querySelector('h1'),
    buttonRegistration = document.querySelector('.button-registation'),
    buttonAuthorization = document.querySelector('.button-authorization'),
    usersTable = document.querySelector('.users-table'),
    usersTableBody = usersTable.querySelector('tbody');

const users = {
    usersList: JSON.parse(localStorage.getItem('usersList')) || [],
    lastId: 0,

    isNumber( num ) {

        return !isNaN( parseFloat( num ) ) && isFinite( num );

    },
    checkName( name ) {

        let flag = true;

        for (let i = 0; i < name.length; i++) {
    
            const regexp = /[а-яёa-z\s]/i;
    
            if (!regexp.test( name[i] ) || this.isNumber( name[i] )) {
                alert('Некорректные данные, запрещено использовать специальные символы!');
                return flag *= false;
            } else if ( name.split(' ').length > 2) {
                alert('Некорректные данные, необходимо ввести только имя и фамилию!');
                return flag *= false;
            } else {
                flag *= true;
            }
            
        }

        return flag;

    },
    checkLogin( login ) {

        let flag = true;

        for (let i = 0; i < login.length; i++) {
    
            const regexp = /[a-z01-9]/i;
    
            if (!regexp.test( login[i] )) {
                alert('Некорректные данные, запрещено использовать пробел, русскую раскладку и специальные символы!');
                return flag *= false;
            } else {
                flag *= true;
            }
            
        }

        return flag;

    },
    getDataRegistration() {

        let dateRegistration = new Date();
        dateRegistration = dateRegistration.toLocaleString('ru');

        return dateRegistration;   

    },
    createUser() {

        let name,
            login,
            password,
            id = this.lastId;

        do {
            name = prompt('Введите Ваше имя и фамилию', 'Павел Мартаков');
        }
        while( !this.checkName( name ) );
        do {
            login = prompt('Введите Ваш логин', 'pasha');
        }
        while( !this.checkLogin( login ) );

        password = prompt('Введите пароль');

        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        const dateRegistration = this.getDataRegistration();

        this.usersList.push({firstName, lastName, dateRegistration, login, password, id});

        this.lastId++;

    },
    deleteUser( event ) {

        this.usersList.forEach( (item, i) => {
            const {id} = item;
            
            if ( id === +event.target.id ) {
                this.usersList.splice( i, 1 );
            }
        });

        this.renderUsersList();
        localStorage.setItem('usersList', JSON.stringify(this.usersList));

    },
    renderUsersList() {

        usersTableBody.innerHTML = `
        <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Дата регистрация</th>
            <th></th>
        </tr>
        `;

        this.usersList.forEach( item => {

            const {firstName, lastName, dateRegistration, id} = item;

            const tableRow = document.createElement('tr');
    
            const tdFirstName = document.createElement('td');
            const tdLastName = document.createElement('td');
            const tdDateReg = document.createElement('td');
            const tdButtonDelete = document.createElement('td');
    
            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('user-delete');
            buttonDelete.id = id;
            buttonDelete.textContent = 'Удалить';
            
            tdFirstName.textContent = firstName;
            tdLastName.textContent = lastName;
            tdDateReg.textContent = dateRegistration;
            tdButtonDelete.append(buttonDelete);
    
            tableRow.append(tdFirstName);
            tableRow.append(tdLastName);
            tableRow.append(tdDateReg);
            tableRow.append(tdButtonDelete);
            
            usersTableBody.append(tableRow);
    
            buttonDelete.addEventListener('click', this.deleteUser.bind(this));

        });

    },

    registation() {

        this.createUser();
        this.renderUsersList();
        localStorage.setItem('usersList', JSON.stringify(this.usersList));

    },

    authorization() {

        const currentLogin = prompt('Введите логин');
        let flagLogin, flagPassword, text;

        this.usersList.forEach( item => {

            const {firstName, lastName, login, password} = item;

            if (login === currentLogin) {
                flagLogin = true;
                const currentPassword = prompt('Введите пароль');

                if (password === currentPassword) {
                    flagPassword = true;
                    text = `Привет, ${firstName} ${lastName}`;
                    return;
                }

                return;
            }
            
        });

        if (flagLogin && flagPassword) {
            h1.textContent = text;
            return;
        } else if (!flagLogin) {
            alert('Пользователь не найден');
            return;
        } else if (!flagPassword) {
            alert('Неверный пароль');
            return;
        }

    },

};

users.renderUsersList();
buttonRegistration.addEventListener( 'click', users.registation.bind(users));
buttonAuthorization.addEventListener('click', users.authorization.bind(users));