import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  mockData: any = null;
    showCustomMock: boolean = false;
    customMockForm: FormGroup;
    generatedInterface: string = '';
    selectedType: 'Cadastro de Usuário' | 'Endereço' | 'Conta Corrente' | '' = '';

    constructor(private fb: FormBuilder) {
      this.customMockForm = this.fb.group({
        fields: this.fb.array([]) // Inicializa o FormArray
      });
    }

    ngOnInit() {}

    // Função para acessar o FormArray de fields
    get fields() {
      return this.customMockForm.get('fields') as FormArray;
    }

    // Adicionar um novo campo ao formulário personalizado
    addField() {
      this.fields.push(this.fb.group({
        key: ['', Validators.required], // A chave é obrigatória
        type: ['string', Validators.required] // O tipo é obrigatório
      }));
    }

    // Remover um campo do formulário personalizado
    removeField(index: number) {
      this.fields.removeAt(index);
    }

    // Gera o mock personalizado com base nos campos do formulário
    generateCustomMock() {
      if (this.customMockForm.invalid) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }

      const fields = this.customMockForm.value.fields;
      this.mockData = this.generateMockFromFields(fields); // Gera o mock
      this.generatedInterface = this.generateInterface(fields); // Gera a interface
    }

    // Gera um mock a partir de campos
    private generateMockFromFields(fields: { key: string; type: string }[]) {
      return fields.reduce((acc: Record<string, any>, field) => {
        acc[field.key] = this.generateMockValue(field.type);
        return acc;
      }, {});
    }

    // Função para mapear tipos de campo para tipos TypeScript
    private mapTypeToTsType(type: string): string {
      const typeMap: Record<string, string> = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
      };
      return typeMap[type] || 'any';
    }

    // Gera a interface TypeScript com base nos campos
    private generateInterface(fields: { key: string; type: string }[]) {
      const interfaceLines = fields.map(field => {
        return `  ${field.key}: ${this.mapTypeToTsType(field.type)};`;
      });

      return `interface CustomMock {\n${interfaceLines.join('\n')}\n}`;
    }

    // Gera um valor mock baseado no tipo
    private generateMockValue(type: string) {
      switch (type) {
        case 'string':
          return 'Texto de exemplo';
        case 'number':
          return Math.floor(Math.random() * 100);
        case 'boolean':
          return Math.random() > 0.5;
        default:
          return null;
      }
    }

    // Limpa os mocks gerados e alterna para o formulário de mock personalizado
    clearMocksAndShowCustomMock() {
      this.mockData = null;
      this.generatedInterface = '';
      this.showCustomMock = true;
    }

    // Alterna entre mocks automáticos e personalizados
    toggleCustomMock() {
      this.showCustomMock = !this.showCustomMock;
      if (this.showCustomMock) {
        this.clearMocksAndShowCustomMock();
      }
    }

    // Função para copiar o conteúdo gerado para a área de transferência
    copyToClipboard(data: any) {
      const textToCopy = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Conteúdo copiado para a área de transferência!');
      }).catch(err => {
        console.error('Erro ao copiar para a área de transferência:', err);
      });
    }
  }
