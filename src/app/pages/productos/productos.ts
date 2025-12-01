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

  filtros = {
    categoria: '',
    marca: '',
    precioMin: 0,
    precioMax: 1000
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
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const cumpleCategoria = !this.filtros.categoria || p.categoria === this.filtros.categoria;
      const cumpleMarca = !this.filtros.marca || p.marca === this.filtros.marca;
      const cumplePrecio = p.precio >= this.filtros.precioMin && p.precio <= this.filtros.precioMax;
      return cumpleCategoria && cumpleMarca && cumplePrecio;
    });
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
      precioMax: 1000
    };
    this.aplicarFiltros();
  }
}