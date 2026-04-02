import Fastify from "fastify";

import items from "data/items.json" with { type: "json" };
import { Item } from "src/types.ts";
import { ItemsGetInQuerySchema, ItemUpdateInSchema } from "src/validation.ts";
import { treeifyError, ZodError } from "zod";
import { doesItemNeedRevision } from "./src/utils.ts";

import cors from "@fastify/cors";

const ITEMS = items as Item[];

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

await fastify.register((await import("@fastify/middie")).default);

// Искуственная задержка ответов, чтобы можно было протестировать состояния загрузки
fastify.use((_, __, next) =>
  new Promise((res) => setTimeout(res, 300 + Math.random() * 700)).then(next),
);

// Настройка CORS
fastify.use((_, reply, next) => {
  reply.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.get<ItemGetRequest>("/items/:id", (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: "Item ID path param should be a number" });
    return;
  }

  const item = ITEMS.find((item) => item.id === itemId);

  if (!item) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
  };
}

fastify.get<ItemsGetRequest>("/items", (request) => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection,
  } = ItemsGetInQuerySchema.parse(request.query);

  const filteredItems = ITEMS.filter((item) => {
    return (
      item.title.toLowerCase().includes(q.toLowerCase()) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length ||
        categories.some((category) => item.category === category))
    );
  });

  return {
    items: filteredItems
      .toSorted((item1, item2) => {
        let comparisonValue = 0;

        if (!sortDirection) return comparisonValue;

        if (sortColumn === "title") {
          comparisonValue = item1.title.localeCompare(item2.title);
        } else if (sortColumn === "createdAt") {
          comparisonValue =
            new Date(item1.createdAt).valueOf() -
            new Date(item2.createdAt).valueOf();
        } else if (sortColumn === "price") {
          const p1 = item1.price ?? 0;
          const p2 = item2.price ?? 0;
          comparisonValue = p1 - p2;
        }

        return (sortDirection === "desc" ? -1 : 1) * comparisonValue;
      })
      .slice(skip, skip + limit)
      .map((item) => ({
        id: item.id,
        category: item.category,
        title: item.title,
        price: item.price,
        needsRevision: doesItemNeedRevision(item),
      })),
    total: filteredItems.length,
  };
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.patch<ItemUpdateRequest>("/items/:id", (request, reply) => {
  const itemId = Number(request.params.id);
  const itemIndex = ITEMS.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) return reply.status(404).send({ success: false });

  const currentItem = ITEMS[itemIndex];
  const updateData = request.body as any;
  const cleanedParams = { ...updateData.params };

  if (currentItem.category === "auto") {
    if (cleanedParams.yearOfManufacture)
      cleanedParams.yearOfManufacture = Number(cleanedParams.yearOfManufacture);
    if (cleanedParams.mileage)
      cleanedParams.mileage = Number(cleanedParams.mileage);
    if (cleanedParams.enginePower)
      cleanedParams.enginePower = Number(cleanedParams.enginePower);

    if (cleanedParams.transmission) {
      const t = cleanedParams.transmission.toLowerCase();
      if (t.includes("авто") || t === "automatic")
        cleanedParams.transmission = "automatic";
      if (t.includes("мех") || t === "manual")
        cleanedParams.transmission = "manual";
    }
  }

  if (currentItem.category === "real_estate") {
    if (cleanedParams.area) cleanedParams.area = Number(cleanedParams.area);
    if (cleanedParams.floor) cleanedParams.floor = Number(cleanedParams.floor);
  }

  ITEMS[itemIndex] = {
    ...currentItem,
    ...updateData,
    price:
      updateData.price !== undefined
        ? Number(updateData.price)
        : currentItem.price,
    params: {
      ...currentItem.params,
      ...cleanedParams,
    },
    updatedAt: new Date().toISOString(),
  };

  return { success: true };
});

const port = Number(process.env.PORT) || 8080;

fastify.listen({ port, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server is listening on ${address}`);
});
