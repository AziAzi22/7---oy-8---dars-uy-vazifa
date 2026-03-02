import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryTitlesEnum } from 'src/enum/category-titles.enum';
import { BotRestaurantInfo } from 'src/schema/bot.fast.food.restorance';
import { BotFoodCategory } from 'src/schema/bot.food.categories';
import { BotFood } from 'src/schema/bot.foods';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(BotFoodCategory.name)
    private categoryModel: Model<BotFoodCategory>,

    @InjectModel(BotFood.name)
    private foodModel: Model<BotFood>,

    @InjectModel(BotRestaurantInfo.name)
    private restaurantModel: Model<BotRestaurantInfo>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryModel.countDocuments();

    if (count > 0) return;

    // create default categories

    const burgerCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.BURGERS,
    });

    const drinkCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.DRINKS,
    });

    const hotDogCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.HOT_DOGS,
    });

    const setCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.SETS,
    });

    const garnishCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.GARNISHES,
    });

    const lavashCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.LAVASH,
    });

    const shawarmaCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.SHAWARMA,
    });

    const desertCategory = await this.categoryModel.create({
      title: CategoryTitlesEnum.DESERTS,
    });

    // create default foods

    await this.foodModel.create([
      {
        title: 'apple kuchen',
        price: 30000,
        description: 'Apple kuchen description goes here',
        image: 'https://picsum.photos/200/300',
        category: desertCategory._id,
      },

      {
        title: 'aydaho',
        price: 20000,
        description: 'cartoffel aydaho description goes here',
        image: 'https://picsum.photos/200/300',
        category: garnishCategory._id,
      },

      {
        title: 'gigant hot-dog',
        price: 40000,
        description: 'the gigant hot-dog description goes here',
        image: 'https://picsum.photos/200/300',
        category: hotDogCategory._id,
      },

      {
        title: 'big shawerma',
        price: 45000,
        description: 'big shawerma description goes here',
        image: 'https://picsum.photos/200/300',
        category: shawarmaCategory._id,
      },

      {
        title: 'big set',
        price: 300000,
        description: 'big set description goes here',
        image: 'https://picsum.photos/200/300',
        category: setCategory._id,
      },

      {
        title: 'shokolad brauni',
        price: 35000,
        description: 'shokolad brauni description goes here',
        image: 'https://picsum.photos/200/300',
        category: desertCategory._id,
      },

      {
        title: 'cheeskeyk',
        price: 30000,
        description: 'cheeskeyk description goes here bla bla bla',
        image: 'https://picsum.photos/200/300',
        category: desertCategory._id,
      },

      {
        title: 'classic hot-dog',
        price: 25000,
        description: 'classic hot-dog description goes here',
        image: 'https://picsum.photos/200/300',
        category: hotDogCategory._id,
      },

      {
        title: 'fanta',
        price: 10000,
        description: 'the cold drink fanta 0.5l',
        image: 'https://picsum.photos/200/300',
        category: drinkCategory._id,
      },

      {
        title: 'cartoffel free',
        price: 15000,
        description: 'cartoffel free description goes here',
        image: 'https://picsum.photos/200/300',
        category: garnishCategory._id,
      },

      {
        title: 'garnir ketchup',
        price: 5000,
        description: 'garnir ketchup description goes here',
        image: 'https://picsum.photos/200/300',
        category: garnishCategory._id,
      },

      {
        title: 'chicken lavash',
        price: 30000,
        description: 'chicken lavash description goes here lorem dolor america',
        image: 'https://picsum.photos/200/300',
        category: lavashCategory._id,
      },

      {
        title: 'latte',
        price: 20000,
        description: 'the cold drink latte with caramelo 0.5l',
        image: 'https://picsum.photos/200/300',
        category: drinkCategory._id,
      },

      {
        title: 'mohito classic',
        price: 20000,
        description: 'mohito classic cold with laym 0.5l',
        image: 'https://picsum.photos/200/300',
        category: drinkCategory._id,
      },

      {
        title: 'lavash with beef',
        price: 40000,
        description: 'cartoffel free description goes here',
        image: 'https://picsum.photos/200/300',
        category: lavashCategory._id,
      },

      {
        title: 'chees burger with only cheese',
        price: 25000,
        description:
          'chees burger with only cheese lorem algoritm nodejs github push',
        image: 'https://picsum.photos/200/300',
        category: burgerCategory._id,
      },

      {
        title: 'mini set',
        price: 150000,
        description: 'mini set for 2 people description goes here',
        image: 'https://picsum.photos/200/300',
        category: setCategory._id,
      },

      {
        title: 'set vegan',
        price: 100000,
        description:
          'set vegan for 2 people with no meat description goes here',
        image: 'https://picsum.photos/200/300',
        category: setCategory._id,
      },

      {
        title: 'shawerma mini',
        price: 30000,
        description:
          'shawerma mini for kids or for 0.5 person description goes here',
        image: 'https://picsum.photos/200/300',
        category: shawarmaCategory._id,
      },

      {
        title: 'garnir garlic',
        price: 5000,
        description:
          'garnir garlic description goes here for shawerma and lavash',
        image: 'https://picsum.photos/200/300',
        category: garnishCategory._id,
      },

      {
        title: 'tee',
        price: 5000,
        description:
          'the green tea and the black tea 0.5l with free milk description',
        image: 'https://picsum.photos/200/300',
        category: drinkCategory._id,
      },

      {
        title: 'triple burger',
        price: 60000,
        description:
          'this is triple burger with free garnir and with three meat',
        image: 'https://picsum.photos/200/300',
        category: burgerCategory._id,
      },

      {
        title: 'vegish shawerma',
        price: 40000,
        description: 'vegish shawerma for vegan  person description',
        image: 'https://picsum.photos/200/300',
        category: shawarmaCategory._id,
      },

      {
        title: 'free water',
        price: 0,
        description: 'free water 0.5l',
        image: 'https://picsum.photos/200/300',
        category: drinkCategory._id,
      },
    ]);

    // restorant info

    const restaurantCount = await this.restaurantModel.countDocuments();

    if (restaurantCount === 0) {
      await this.restaurantModel.create({
        name: 'Najot Food',
        description: 'Best fast food in the city 🍔',
        phone: '+998901234567',
        email: 'info@najotfood.uz',
        address: 'Tashkent, Uzbekistan',
      });
    }

    console.log('Database seeded 🚀');
  } 
}
