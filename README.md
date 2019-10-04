# lgx-axios-dev-tools

Libreria de Javascript/Typescript basada en axios para hacer consultas en api. Permite recuperar, actualizar y eliminar objectos a través de una sintaxis clara y facil de utilizar. Las consultas se pueden hacer con observables o promesas. 

## Instalación 
```javascript
npm install lgx-axios-dev-tools --save
```
## Uso
Crear una clase base que extienda de Model de lgx-axios-dev-tools con la url base.
```javascript
import { Model } from "lgx-axios-dev-tools";

export class Base extends Model {
    baseUrl(): string {
        return 'http://localhost:3000/';
    }
}
```
Crear modelos a partir de la clase base.
```javascript
export class User extends Base {
    resource = 'users';
}
```

## Métodos
### find
```javascript
User.find();
```

### findfindById
```javascript
User.findById(120);
```

### save
```javascript
User.save({
    firstName: "Luis gabriel",
    lastName: "Acevedo ramírez"
});
```

### update
```javascript
const model = {
    id: 1,
    firstName: "Luis gabriel",
    lastName: "Acevedo ramírez"
}
User.update(1, model);
```
 
### destroy
```javascript
User.destroy(1);
```

### orWhere
```javascript
User.orWhere(['name', 'profile.first_name', 'profile.last_name'], 'Luis').find();
```

### option
```javascript
User.option('rules', 'true').find();
```

### with
```javascript
User.with(['profile', 'roles', 'settings']).find();
```

### orderBy
```javascript
User.orderBy('created_at', 'desc').find();
```

### noPagination
```javascript
User.noPagination().find();
```

### url
```javascript
User.url('/new_url').find();
```

### header
```javascript
User.header('pin_code', '123456').find();
```