import { Test, type TestingModule } from "@nestjs/testing"
import { ItemsService } from "./items.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Item } from "./entities/item.entity"
import { jest } from "@jest/globals"

describe("ItemsService", () => {
  let service: ItemsService
  let mockRepository: any

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ItemsService>(ItemsService)
  })

  describe("findAll", () => {
    it("should return an array of items", async () => {
      const mockItems = [
        {
          id: 1,
          name: "Tomato",
          quantity: 50,
        },
      ]

      mockRepository.find.mockResolvedValue(mockItems)

      const result = await service.findAll()
      expect(result).toEqual(mockItems)
    })
  })
})
