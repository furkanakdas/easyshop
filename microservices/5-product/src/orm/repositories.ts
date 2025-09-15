import { AppDataSource } from './data-source'; // veri kaynağını import et
import { AttributeDefinition } from './entity/attribute-definition';
import { Category } from './entity/category';
import { Inventory } from './entity/inventory';
import { OutboxEvent } from './entity/outbox-event';
import { Product } from './entity/product';
import { ProductAttributeValue } from './entity/product-attribute-value';
import { SellerProfile } from './entity/seller-profile';
import { Tag } from './entity/tag';

// Repository'yi burada tanımlıyoruz
// export const userRepository = AppDataSource.getRepository(User);
// export const bookRepository = AppDataSource.getRepository(Book);




export const productRepository = AppDataSource.getRepository(Product);




export const attributeDefinitionRepository = AppDataSource.getRepository(AttributeDefinition);
export const productAttributeValueRepository = AppDataSource.getRepository(ProductAttributeValue);
export const inventoryRepository = AppDataSource.getRepository(Inventory);
export const tagRepository = AppDataSource.getRepository(Tag);
export const sellerProfileRepository = AppDataSource.getRepository(SellerProfile);
export const outboxEventRepository = AppDataSource.getRepository(OutboxEvent);





export const categoryRepository = AppDataSource.getRepository(Category).extend({


    async getCategoryParentsAsc(category: Category) {

        let tempCategory: Category | null = { ...category };

        const categories: Category[] = [];

        categories.push(tempCategory);

        while (tempCategory?.parentId) {


            tempCategory = await this.findOne({ where: { id: tempCategory.parentId } });

            categories.push(tempCategory!);

        }

        return categories

    }


});


export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query('SELECT 1'); // Basit ve hızlı bir sorgu
    await queryRunner.release();
    return true;
  } catch (err) {
    return false;
  }
}


class HelperRepository{


}


export  const helperRepository = new HelperRepository()