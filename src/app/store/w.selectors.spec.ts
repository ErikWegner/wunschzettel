import { AppStateBuilder } from 'testing/app.state.builder';
import { AppState } from './app.state';
import { selectActiveItemAsFormData, selectCategories } from './w.selectors';

describe('Wishlist selectors', () => {
  const initialState: AppState = {
    ag: { pendingRequest: false },
    wishlist: {
      categories: ['Book', 'Game', 'Everything else'],
      items: [],
      activeItem: null,
    },
  };

  it('should select the categories', () => {
    const result = selectCategories.projector(initialState.wishlist);
    expect(result.length).toEqual(3);
    expect(result[1]).toEqual('Game');
  });

  describe('active item', () => {
    const initialState = AppStateBuilder.hasActiveItem();

    it('should map active item to form fields', () => {
      const result = selectActiveItemAsFormData.projector(
        initialState.wishlist
      );
      expect(result as any).toEqual({
        title: 'Faust I + II',
        description: `Mit Goethes Faust wird Johann Wolfgang von Goethes Bearbeitung des
      Fauststoffs bezeichnet. Der Begriff kann sich auf den ersten Teil der
      durch Goethe geschaffenen Tragödie, auf deren ersten und zweiten Teil
      gemeinsam oder insgesamt auf die Arbeiten am Fauststoff beziehen, die
      Goethe durch sechzig Jahre hindurch immer wieder neu aufnahm. Er umfasst
      in diesem letzteren Sinne auch die Entwürfe, Fragmente, Kommentare und
      Paralipomena des Dichters zu seinem Faustwerk und zum Fauststoff.`,
        category: 'Buch',
        imagesrc:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kersting_-_Faust_im_Studierzimmer.jpg/220px-Kersting_-_Faust_im_Studierzimmer.jpg',
        buyurl: 'https://de.wikipedia.org/wiki/Goethes_Faust',
        id: 1,
      });
    });
  });
});
