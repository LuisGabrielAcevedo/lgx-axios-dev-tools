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
  baseUrl() {
    return "http://localhost:3000";
  }
}
```

Crear modelos a partir de la clase base.

```javascript
export class User extends Base {
  resource = "users";
}
```

## Métodos

### Promesas

#### find

```javascript
// find(page?: number, perPage?: number): Promise<any>;
const resp = await User.find();
```

#### findById

```javascript
// findById(id: string | number): Promise<any>;
const resp = await User.findById(120);
```

#### save

```javascript
// save(model: ILgxModel): Promise<any>;
const resp = await User.save({
  firstName: "Luis gabriel",
  lastName: "Acevedo ramírez"
});
```

#### update

```javascript
// update(id: string | number, model: ILgxModel): Promise<any>;
const resp = await User.update(1, {
  id: 1,
  firstName: "Luis gabriel",
  lastName: "Acevedo ramírez"
});
```

#### destroy

```javascript
// destroy(id: string | number): Promise<any>;
const resp = await User.destroy(1);
```

### Observables

#### findRx

```javascript
// findRx(page: number, perPage: number): Observable<any>;
User.findRx().subscribe(resp => console.log(resp));
```

#### findByIdRx

```javascript
// findByIdRx(id: string | number): Observable<any>;
User.findById(120).subscribe(resp => console.log(resp));
```

#### saveRx

```javascript
// saveRx(model: ILgxModel): Observable<any>;
User.saveRx({
  firstName: "Luis gabriel",
  lastName: "Acevedo ramírez"
}).subscribe(resp => console.log(resp));
```

#### updateRx

```javascript
// updateRx(id: string | number, model: ILgxModel): Observable<any>;
User.updateRx(1, {
  id: 1,
  firstName: "Luis gabriel",
  lastName: "Acevedo ramírez"
}).subscribe(resp => console.log(resp));
```

#### destroyRx

```javascript
// destroyRx(id: string | number): Observable<any>;
User.destroyRx(1).subscribe(resp => console.log(resp));
```

### Query

#### page

```javascript
// page(page: number): Builder;
const resp = await User.page(1).find();
```

#### perPage

```javascript
// perPage(page: number): Builder;
const resp = await User.page(1)
  .perPage(10)
  .find();
```

#### noPagination

```javascript
// noPagination(): Builder
const resp = await User.noPagination().find();
```

#### orderBy

```javascript
// orderBy(attribute: string, direction?: ELgxSortDirection): Builder;
import ELgxSortDirection from "lgx-axios-dev-tools";
const resp = await User.page(1)
  .perPage(10),
  .orderBy("updateAt", ELgxSortDirection.ASC)
  .find();
```

#### with

```javascript
// with(value: string | string[]): Builder;
const resp = await User.page(1)
  .perPage(10),
  .orderBy("updateAt", ELgxSortDirection.ASC)
  .with("settings")
  .find();
```

#### option

```javascript
// option(queryParameter: string, value: string): Builder;
const resp = await User.page(1)
  .perPage(10),
  .orderBy("updateAt", ELgxSortDirection.ASC)
  .with("settings"),
  .option("active", "true")
  .find();
```

### FormData

```javascript
// formData(): Builder;
const resp = await User.formData().save({
  firstName: "Luis gabriel",
  lastName: "Acevedo ramírez",
  image: {} // Objeto de tipo File o Blob
});
```

### Métodos Url

#### url

```javascript
// url(url: string): Builder;
const resp = await User.url("/newUrlParams").find();
```

#### urlParam

```javascript
// urlParam(urlParam: string): Builder;
const resp = await User.urlParam("urlParams").find();
```

### Header

```javascript
// header(header: string, value: string): Builder;
const resp = await User.header("pin_code", "123456").destroy(23);
```

## Interceptor

```javascript
import { Model } from "lgx-axios-dev-tools";

export class YoutubeBaseModel extends Model {
  public baseUrl() {
    return "https://www.googleapis.com/youtube";
  }
}

YoutubeBaseModel.getInstance().interceptors.request.use(request => {
  request.headers["Authorization"] ="Token"
  console.log(request);
  return request;
});

YoutubeBaseModel.getInstance().interceptors.response.use(response => {
  console.log(response);
  return response;
});
```

## Como cambiar los valores de salida de los parámetros de la query

```javascript
import { Model, ILgxQueryConfig } from "lgx-axios-dev-tools";

export class Base extends Model {
  public queryConfig: ILgxQueryConfig = {
    orderBy: "sort",
    with: "embed",
    per_page: "itemsPerPage"
  };

  baseUrl() {
    return "http://localhost:3000";
  }
}
```

## Angular

```javascript
import { Component, OnInit } from "@angular/core";
import { Model, ELgxSortDirection } from "lgx-axios-dev-tools";

class BaseModel extends Model {
  public baseUrl() {
    return "http://localhost:3000";
  }
}

class Product extends BaseModel {
  public resource = "products";
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public page = 1;
  public perPage = 10;
  public products: object[] = [];
  constructor() {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    Product.page(this.page)
      .perPage(this.perPage)
      .orderBy("updatedAt", ELgxSortDirection.DESC)
      .findRx()
      .subscribe(products => (this.products = products));

    // http://localhost:3000/products?orderBy=-updatedAt&page=1&per_page=10
  }

  changePage(page: number) {
    this.page = page;
    this.loadProducts();
  }

  changePerPage(perPage: number) {
    this.perPage = perPage;
    this.loadProducts();
  }
}
```

## Vue

```javascript
import { Component, Vue } from "vue-property-decorator";
import Template from "./App.vue";
import { Model, ELgxSortDirection, ILgxResponse } from "lgx-axios-dev-tools";

class BaseModel extends Model {
  public baseUrl() {
    return "http://localhost:3000";
  }
}

class Product extends BaseModel {
  public resource = "products";
}

@Component({
  mixins: [Template]
})
export default class App extends Vue {
  public page = 1;
  public perPage = 10;
  public products: object[] = [];

  public mounted() {
    this.loadProducts();
  }

  public async loadProducts() {
    const resp: ILgxResponse = await Product.page(this.page)
      .perPage(this.perPage)
      .orderBy("updateAt", ELgxSortDirection.DESC)
      .find();

    // http://localhost:3000/products?orderBy=-updatedAt&page=1&per_page=10

    this.products = resp.data;
  }

  changePage(page: number) {
    this.page = page;
    this.loadProducts();
  }

  changePerPage(perPage: number) {
    this.perPage = perPage;
    this.loadProducts();
  }
}
```

## React

```javascript
import React, { Component } from "react";
import { Model, ELgxSortDirection, ILgxResponse } from "lgx-axios-dev-tools";

class BaseModel extends Model {
  public baseUrl() {
    return "http://localhost:3000";
  }
}

class Product extends BaseModel {
  public resource = "products";
}

class App extends Component {
  public page = 1;
  public perPage = 10;
  state = {
    products: []
  };

  componentDidMount() {
    this.loadProducts();
  }

  public async loadProducts() {
    const resp: ILgxResponse = await Product.page(this.page)
      .perPage(this.perPage)
      .orderBy("updateAt", ELgxSortDirection.DESC)
      .find();

    // http://localhost:3000/products?orderBy=-updatedAt&page=1&per_page=10

    this.setState({
      products: resp.data
    });
  }

  changePage(page: number) {
    this.page = page;
    this.loadProducts();
  }

  changePerPage(perPage: number) {
    this.perPage = perPage;
    this.loadProducts();
  }

  render() {
    return <div className="App">{/* Table */}</div>;
  }
}

export default App;
```
