import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';



export class RegistryClientWrapper {


  private _schemaRegistry?: SchemaRegistry;

  get schemaRegistry() {
    if (!this._schemaRegistry) {
      throw new Error('Cannot access Registry client before connecting');
    }

    return this._schemaRegistry;
  }

  set schemaRegistry(registry: SchemaRegistry ) {
    this._schemaRegistry = registry;
  }

  constructor() { }

  async initiate(host: string) {

    const registry = new SchemaRegistry({ host: host });

    this.schemaRegistry = registry;

  }


  async decodeMessage(value:any) {


    const decoded = await this.schemaRegistry.decode(value);

    return decoded;
  }


  async encodeMessage(subject:string,value:any) {

      const id = await this.schemaRegistry.getLatestSchemaId(subject);
      const encodedValue = await this.schemaRegistry.encode(id, value);

      return encodedValue
  }



}


export const registryWrapper = new RegistryClientWrapper();
