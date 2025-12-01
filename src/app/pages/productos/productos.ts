import { Component } from '@angular/core';
import { Menu } from "../../components/menu/menu";
import { PiePagina } from "../../components/pie-pagina/pie-pagina";
import { ScrollToTop } from "../../components/scroll-to-top/scroll-to-top";
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos/productos-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [Menu, PiePagina, ScrollToTop, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  marcas: string[] = [];
  precioMaximoProductos: number = 0;
  mostrarFiltros: boolean = false;
  ordenSeleccionado: string = '';

  filtros = {
    categoria: '',
    marca: '',
    precioMin: 0,
    precioMax: 0
  };

  constructor(private router: Router, private productosService: ProductosService) { }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const cache = localStorage.getItem('listaProductos');
    if (cache) {
      this.productos = JSON.parse(cache).map((p: any) => ({
        ...p,
        fechaLanzamiento: new Date(p.fechaLanzamiento)
      }));
      this.inicializarFiltros();
    } else {
      this.productosService.obtenerProductos().subscribe({
        next: (lista) => {
          this.productos = lista;
          localStorage.setItem('listaProductos', JSON.stringify(this.productos));
          this.inicializarFiltros();
        },
        error: (err) => console.error('Error cargando productos:', err)
      });
    }
  }

  private inicializarFiltros(): void {
    this.categorias = [...new Set(this.productos.map(p => p.categoria))].sort();
    this.marcas = [...new Set(this.productos.map(p => p.marca))].sort();

    // Calcular precio máximo de todos los productos
    this.precioMaximoProductos = Math.ceil(Math.max(...this.productos.map(p => p.precio)));
    this.filtros.precioMax = this.precioMaximoProductos;

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const cumpleCategoria = !this.filtros.categoria || p.categoria === this.filtros.categoria;
      const cumpleMarca = !this.filtros.marca || p.marca === this.filtros.marca;
      const cumplePrecio = p.precio >= this.filtros.precioMin && p.precio <= this.filtros.precioMax;
      return cumpleCategoria && cumpleMarca && cumplePrecio;
    });

    this.ordenarProductos();
  }

  seleccionarCategoria(categoria: string): void {
    this.filtros.categoria = this.filtros.categoria === categoria ? '' : categoria;
    this.aplicarFiltros();
  }

  seleccionarMarca(marca: string): void {
    this.filtros.marca = this.filtros.marca === marca ? '' : marca;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtros = {
      categoria: '',
      marca: '',
      precioMin: 0,
      precioMax: this.precioMaximoProductos
    };
    this.aplicarFiltros();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  ordenarProductos(): void {
    switch (this.ordenSeleccionado) {
      case 'precio-desc':
        this.productosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'precio-asc':
        this.productosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'nombre-asc':
        this.productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        // Sin ordenación específica
        break;
    }
  }

  añadirFavorito(producto: Producto) {
    // Verificar si hay usuario autenticado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');

    if (!usuarioActual.id) {
      alert('Debes iniciar sesión para añadir favoritos');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener lista de favoritos del usuario
    const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuarioActual.id}`) || '[]');

    // Verificar si el producto ya está en favoritos
    if (favoritos.some((p: Producto) => p.id === producto.id)) {
      alert('Este producto ya está en tus favoritos');
      return;
    }

    // Añadir el producto a favoritos
    favoritos.push(producto);
    localStorage.setItem(`favoritos_${usuarioActual.id}`, JSON.stringify(favoritos));

    alert('Producto añadido a favoritos');
  }
}