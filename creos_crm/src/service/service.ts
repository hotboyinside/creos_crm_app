import { pokemonStore, paginationData } from "@/store/store";
import { PokemonFetch } from "@/transport/transport";
import { PokemonData } from "@/model/model";

const pokemonTransport = PokemonFetch.getInstance();

interface pokemonServiceInterface {
    getDataFromApi(): Promise<PokemonData[]>
    clickedBtn(event: Event): Promise<void>
}

export class PokemonService implements pokemonServiceInterface {
    private static instance: PokemonService;

    constructor() {};

    public static getInstance(): PokemonService {
        if (!PokemonService.instance) {
            PokemonService.instance = new PokemonService();
        }

        return PokemonService.instance;
    }

    public async getDataFromApi(): Promise<PokemonData[]> {
        if (paginationData.currentPokemons >= paginationData.countPokemons) {
            return []
        }
        const data = await pokemonTransport.getDataAboutPokemons(paginationData.currentPokemons, 20);
        paginationData.countPokemons = data.count;
        pokemonStore.push(...data.results);
        
        let pokemonId: number = 1
        const detailPromises = pokemonStore.map(async (item) => {
            item.id = pokemonId++;
            item.catched = false;
            const pokemonDetails = await pokemonTransport.getDetailsPokemon(item.name);
            item.avatar = pokemonDetails['sprites']['front_shiny'];
        });
        
        await Promise.all(detailPromises);

        return pokemonStore
    }

    public async clickedBtn(event: Event) {
        // при нажатии на кнопку карточки, меняю флаг catched на true
        const button = event.target as HTMLElement;
        const curr_id = Number(button.getAttribute('data-id'));
        const updatedPokemons = pokemonStore.map((value) => {
            if (value.id === curr_id) {
                value.catched = true;
            }
            return value
        });
        pokemonStore.length = 0;
        pokemonStore.push(...updatedPokemons);
        button.setAttribute('disabled', 'disabled')
        button.innerText = 'Пойман!'
    }
}