export interface Pedido {
    id: number;
    idUsuario: number;
    fecha: Date;
    listaProductos: ProductoOrden[];
    precioTotal: number;
    estado: string;
    numFactura: number;
    subprecio: number;
    iva: number;
}

export interface ProductoOrden {
    idProducto: number;
    cantidad: number;
    precio: number;
}