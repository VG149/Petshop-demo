import { Component, OnInit } from '@angular/core';
import { PetshopService } from '../services/petshop.services';

interface Petshop {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  horariosDisponiveis: {
    inicio: string;
    fim: string;
  };
  diasDisponiveis: string[];
  avaliacao?: number;
  imagem?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  petshops: Petshop[] = [];
  loading = true;
  error = '';

  diasSemana: { [key: string]: string } = {
    'segunda': 'Segunda',
    'terca': 'Terça',
    'quarta': 'Quarta',
    'quinta': 'Quinta',
    'sexta': 'Sexta',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };

  constructor(private petshopService: PetshopService) {}

  ngOnInit() {
    this.carregarPetshops();
  }

  carregarPetshops() {
    this.loading = true;
    this.error = '';
    
    this.petshopService.getPetshops()
      .then((petshops: any) => {
        this.petshops = petshops;
        this.loading = false;
      })
      .catch((err: any) => {
        this.error = 'Erro ao carregar petshops. Tente novamente.';
        console.error(err);
        this.loading = false;
      });
  }

  formatarDias(dias: string[]): string {
    return dias.map(d => this.diasSemana[d] || d).join(', ');
  }

  abrirDetalhes(petshop: Petshop) {
    // Navegação para página de detalhes/agendamento
    console.log('Abrir detalhes:', petshop);
  }

  gerarEstrelas(avaliacao: number = 0): number[] {
    return Array(5).fill(0).map((_, i) => i < avaliacao ? 1 : 0);
  }
}
