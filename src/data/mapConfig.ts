const mapConfig = [
  {
    name: "witcher3",
    mapOptions: [
      {
        name: "White Orchard",
        path: "white-orchard",
        imagePath: "https://i.ibb.co/6DbBXnf/fablesphere.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,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",
      },
      {
        name: "Velen & Novigrad",
        path: "velen-novigrad",
        imagePath: "https://i.ibb.co/V361TC7/velen-novigrad.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAG7AoYDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAECBAUD/8QAFhABAQEAAAAAAAAAAAAAAAAAABEB/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A5QGGQAAAAAAAAAUVAFEVBABQAAAUAQQAEABABUABEVARFQERUBEVFETV1NBE1UETWdVARNXU1RGWmQRFQRNRUUEVBEAAABQAVUVFFRQVUUBUUVQEFVFAVFAAFFQBQAeiArmAAogCgAAAACgAACKAAAAACiKiACAAAgAqIqAIAIioCIqAiKiiJq6mgiGoIiLqAiaqaoymqmgiKgiaioogAiAAAAoigoCKqooKqAKqKKoCCqgCgAoAoAAAD0hBpzUQQUAAAAAVRAFEAUQRVEAUQAAFARAAAQBRAAQARFQBBAEAEQRQTRNBNRdQE1F1lURNVARNVnQEEEEEUEVBAEBRAFVAFVFFVWVQVUUFVAVVRQURUFEUBUBVEUAAHoiDTmogCgIAACoCqIAogCiCKogCiAAAoCAqAgIAogAIAICAIIAgKIisgIIBrK6gJqaus6qCCAiaqaCIrKoIIACCAICiKAqKCiKKqoINCKCqgK0IoKAgoigogKoAAAPREGnNRAFEAUQQUQFUAFEAUQFUQQFQFAQFEAAQVUEQVAAQQBFRQQQBBAEEAQQBlUBE1WdVBnVTQRFZAQTVQQQBAEBAFEAVUAaEUFVAVpWVQVUUVRFBVZUFEVBRAFAFAAegINOaiAKIoCoAogiqIAogCiAqiAKIIqiAKggKICggAIAIACCAIqAIIAyqAiKgJqLrOqCCAM6qCImiaAzqpqogIAgggIKKIA0rKoKrKg0rKitCKgqoCtCKCiKCiKCiAKAKAIO8Qac1EAaGQGhlQUQFUQQUQFUQBRAFEEVRAFRAVRAAQABABABBAVBAEEAQQBBAE0TVE1BANQ1BETTUUNQ1NAQZEVEKqAgCiAjSs1RWhlUGlZUVpWVBpWVRVVlQVUAVUAVUBVEAUQB3iCuaiALSoAqsgrRWVBaIAogiqIUFEBVEAUQQBAVREBRAAQAEBRBAAQBBAEEAQRQTRBERdZ0DUE0DWdN1NVDU03Wd0CpTdTdVCpUpRFpWRRoZUGis1ag0rNXNBpWVRWlZUGlZUVoRUFVlQUQBoQFUQBRAHeVmlVzaozVBSpSgtKlBVEKDVGaCtDNKDVGRBoSpRWqMgNJUpRVEKColEFqUQVREoKJUBalEAEQFQQBBFBBAEprOgVNNSiDOm6m6obqbpus7oG6m6m6m6qG6m6m6giiCgAAqAKIA1VrK0RurWM1c1FbVmqg0rOKK0IA0rIDQioKICqIA0IA7RKVpzWlSlBaVKCqtZpUGqM0oNFSlFWlZWgtKlBVEpUFpUoKolSg1UqFBSpUoq0qUAohQVKlKBSpUoLUqUAqUQCpRKBUpUA3U3TWdBd1ndN1N0DdZ3TdTdUN1ndN1ndEN1BFSgCoAAAAAAAAKgC1rNYWg3mrmsZq5qDdWs1c0VqqytQaEpQaEpRWisrQUSlBaJQHbSoK5rSoUVqlZpQapWaUGqVmlFapWatQWlSgLSpSirSpSgtKlKirRKlBqpUpRVKlSg1UqUoLUSlBUSlFVKlQFqUqUFqVKlBalSpQWs0qboG6m6m6m6BupupupuqG6zum6gCKis0QFZAAAAAAAAAAAAAAUqAN5q1irUVurWKtBurWKtBqqzSorSs0oNDNKDQlAdlKlKrC0qUoLVZpQapWaA1Ss0orVKzVoLSpRFWlSlBaVKUVaVKUFpUqUVqpUpUFpUqUGqlSlFWpUpQWpUpQWpUqUFqVKUCpSpRSpSs0F3U3U3U3QN1N1N1FDdQBEBFZogKyAAAAAAAAAAAAAAAAAAKgC1ayorVWs0qK3VrFWg1VrFWg1Ss0oNUZoDtpWaVWGqVmlBqlSgLVrNKK1Ss0qDVKzSitUrNKDVKzSitUqVKg1Ss0orVKzSg1UqUoLSs0oq0qVKDVSpUoNVKlSoq1KlKC1KlSgtSpWd0VrdZ3U3Uqi7rNABAEEBWagIrIAIAAAAAAAAAAAAAAAAAAAAAAogK0IBq1ayoq0qALRAHbSs0ow1Ss0oNUrNKDVKzSitUqUoNUrNKK1Ss0qDVKzSitUrNKK1Ss0oNVKlKKtKzSoNVKlSitUrNKC1KlSg1UqVKKtSpUoLUqVBV3UogAAggCCArIgis0AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAUQBRAVRANddKzSqy1SpSgtWs0orVKzSg1Ss0qK1Ss1aC0qUoq0qUoq0qUoLSpUqK1Ss0orVSpUoNUrNKKtKzUoNVKlSirSogLUBAQAABBAEEVFQQBmoArIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADopWaVpGqVmlBqlZpRWqVKUGqVmlRWqVmlFapWaUVqlZpQapWaVFapWaUVaVmlFaqVKAtSoCrRBAAABEAAQAAQBAEVAEGaICsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPpSoNotKgK1SsgNUqCKtKgKtWsgrVKyoKIiK1UAUoAoAAAgAIAIKqAiAAAIAAIAioAggCKyACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANCDoiiCKoAKICqAKKgiqIooAAAiioAoiooCAqAgAAAIAIIAAAKiACCAIgCsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKKOiIKAAIoCigAoAACooAKAIAAoAAAgAIoAACIgAAAIIqKAAiAisgAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQo2iKKCCkFQUBFFFQURUFBUFAQUFQUQQUFQVAAEABAABAEAAQRUVAEEEVFQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfWEUbRIKQEIoghGgVBQEFBUIqxFZGgGSNArMI0AyNRBUIpEGSNIKiNRICCxEEFQABEEVFQAERFRUABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3FhGmUFhBUUUEFICCiKgqggoKgoCCiKgoCCwFZGkBBSAzCNIgzCNRIKzEjUIDKNRIgiKKIAIiKKygAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADpFFZQUFBQEFAQUFRQAFEEFBUFAQUBBQVEaRBBQESNICRGkFRI0kQZg0gMo0gMo0ijIqDKAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADrFFZQUBFAUBQQUBBRFQUAAAAFAAAEEFAQUFZFARGkQRGkBEUBlGkQZRpAZTWk1UZRrUaRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdoCsgKCCgqCgIoIAAAKKgoCCgIKIqCgIACCgIKgIKIMioCCoCIogyjSAymtJqoxqNaioiKKqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7gFZAABRBBQUAAAAAFAABRBBQEAFAAEUBAEEFQEFQEFQERRBlGkBnUaQRnU1rWdVERUUQVFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3gKyAIAAoAAAAoAACgAACAAAAAigqAICKAgAIACIoCIqIIioIiaqaCJq6mqiIqKIiiqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8AZAAABQFAAAAAAAAFAEAVAAAAAEVBQBARUARUBAARFRARUETUXUQZ1F1GkRFRUQVFVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=",
      },
      {
        name: "Skellige Isles",
        path: "skellige",
        imagePath: "https://i.ibb.co/YhGYntq/skellige.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,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",
      },
      {
        name: "Kaer Morhen",
        path: "kaer-morhen",
        imagePath: "https://i.ibb.co/ZS7X6f0/kaer-morhen.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,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",
      },
      {
        name: "Toussaint",
        path: "toussaint",
        imagePath: "https://i.ibb.co/r6X4cg4/toussaint.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,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",
      },
    ],
  },
  {
    name: "totk",
    mapOptions: [
      {
        name: "Hyrule",
        path: "hyrule",
        imagePath: "https://i.ibb.co/9NwDhmC/hyrule.jpg",
        blurDataUrl:
          "data:image/jpeg;base64,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",
      },
    ],
  },
];

export default mapConfig;
