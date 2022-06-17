import * as log from './logger';
import { VENDOR_CODES } from '../constants';
import {
  Abercrombie,
  Adidas,
  Aerie,
  BedBathBeyond,
  Belk,
  BrooksBrothers,
  CalvinKlein,
  Carters,
  Chicos,
  Converse,
  Express,
  FashionNova,
  FinishLine,
  FootLocker,
  FreePeople,
  GAP,
  Gymboree,
  HM,
  JCPenney,
  JCrew,
  Journeys,
  kMccarthy,
  Kohls,
  LaneBryant,
  Levi,
  Lululemon,
  Macys,
  Nordstrom,
  NordstromRack,
  NorthFace,
  OldNavy,
  ShoeCarnival,
  Skechers,
  Soma,
  SteveMadden,
  Talbots,
  Target,
  TJMaxx,
  UnderArmour,
  VictoriaSecret,
  Walmart,
  WhiteHouse,
  Zara,
  Vans,
  Lush,
  MacCosmetics,
  LuckyBrand,
  MichaelKors,
  Dillards,
  AltardState,
  AnnTaylor,
  Athleta,
  Aveda,
  BrightonCollectibles,
  Coach,
  Forever21,
  Gucci,
  Burberry,
  Claires,
  DakotaWatch,
  DavidYurman,
  EverythingButWater,
  Fabletics,
  KateSpade,
  GNCLiveWell,
  GoldenGoose,
  GusMayer,
  Freebird,
  JohnnyWas,
  JohnstonAndMurphy,
  JosABank,
  KayJewelers,
  KiehlsSince1851,
  LillyPulitzer,
  Marmi,
  MollyGreen,
  Morphe,
  Pandora,
  SoftSurroundings,
  Sephora,
  Sundance,
  SunglassHut,
  TheContainerStore,
  TiffanyAndCo,
  TommyJohn,
  ToryBurch,
  Untuckit,
  WilliamsSonoma,
  JJill,
  CrateAndBarrel,
  BognarAndPiccolini,
  DryGoods,
  EileenFisher,
  Apple,
  Buckle,
  Evereve,
  LoccitaneEnProvence,
  UltaBeauty,
  Loft,
  Lulus,
  PotteryBarm,
  AlexPlusNova,
  AmazingLace,
  EagleEyeOutfitters,
  PrettyLittleThing,
  Skims,
  ErinCondren
} from './vendors';
import { OrderData, IEmailPayload } from '../models';

const parse = async (code: string, payload: IEmailPayload): Promise<OrderData | undefined> => {
  try {
    let orderData: OrderData | undefined;

    switch (code) {
      case VENDOR_CODES.NORDSTROM:
        orderData = await Nordstrom.parse(code, payload);
        break;
      case VENDOR_CODES.LULULEMON:
        orderData = await Lululemon.parse(code, payload);
        break;
      case VENDOR_CODES.ABERCROMBIE:
        orderData = await Abercrombie.parse(code, payload);
        break;
      case VENDOR_CODES.ADIDAS:
        orderData = await Adidas.parse(code, payload);
        break;
      case VENDOR_CODES.AERIE:
        orderData = await Aerie.parse(code, payload);
        break;
      case VENDOR_CODES.BEDBATHBEYOND:
        orderData = await BedBathBeyond.parse(code, payload);
        break;
      case VENDOR_CODES.BELK:
        orderData = await Belk.parse(code, payload);
        break;
      case VENDOR_CODES.BROOKSBROTHERS:
        orderData = await BrooksBrothers.parse(code, payload);
        break;
      case VENDOR_CODES.CALVINKLEIN:
        orderData = await CalvinKlein.parse(code, payload);
        break;
      case VENDOR_CODES.CARTERS:
        orderData = await Carters.parse(code, payload);
        break;
      case VENDOR_CODES.CHICOS:
        orderData = await Chicos.parse(code, payload);
        break;
      case VENDOR_CODES.CONVERSE:
        orderData = await Converse.parse(code, payload);
        break;
      case VENDOR_CODES.EXPRESS:
        orderData = await Express.parse(code, payload);
        break;
      case VENDOR_CODES.FASHIONNOVA:
        orderData = await FashionNova.parse(code, payload);
        break;
      case VENDOR_CODES.FINISHLINE:
        orderData = await FinishLine.parse(code, payload);
        break;
      case VENDOR_CODES.FOOTLOCKER:
        orderData = await FootLocker.parse(code, payload);
        break;
      case VENDOR_CODES.FREEPEOPLE:
        orderData = await FreePeople.parse(code, payload);
        break;
      case VENDOR_CODES.GAP:
        orderData = await GAP.parse(code, payload);
        break;
      case VENDOR_CODES.GYMBOREE:
        orderData = await Gymboree.parse(code, payload);
        break;
      case VENDOR_CODES.HM:
        orderData = await HM.parse(code, payload);
        break;
      case VENDOR_CODES.JCPENNEY:
        orderData = await JCPenney.parse(code, payload);
        break;
      case VENDOR_CODES.JCREW:
        orderData = await JCrew.parse(code, payload);
        break;
      case VENDOR_CODES.JOURNEYS:
        orderData = await Journeys.parse(code, payload);
        break;
      case VENDOR_CODES.KMCCARTHY:
        orderData = await kMccarthy.parse(code, payload);
        break;
      case VENDOR_CODES.KOHLS:
        orderData = await Kohls.parse(code, payload);
        break;
      case VENDOR_CODES.LANEBRYANT:
        orderData = await LaneBryant.parse(code, payload);
        break;
      case VENDOR_CODES.LEVI:
        orderData = await Levi.parse(code, payload);
        break;
      case VENDOR_CODES.MACYS:
        orderData = await Macys.parse(code, payload);
        break;
      case VENDOR_CODES.NORDSTROMRACK:
        orderData = await NordstromRack.parse(code, payload);
        break;
      case VENDOR_CODES.NORTHFACE:
        orderData = await NorthFace.parse(code, payload);
        break;
      case VENDOR_CODES.OLDNAVY:
        orderData = await OldNavy.parse(code, payload);
        break;
      case VENDOR_CODES.SHOECARNIVAL:
        orderData = await ShoeCarnival.parse(code, payload);
        break;
      case VENDOR_CODES.SKECHERS:
        orderData = await Skechers.parse(code, payload);
        break;
      case VENDOR_CODES.SOMA:
        orderData = await Soma.parse(code, payload);
        break;
      case VENDOR_CODES.STEVEMADDEN:
        orderData = await SteveMadden.parse(code, payload);
        break;
      case VENDOR_CODES.TALBOTS:
        orderData = await Talbots.parse(code, payload);
        break;
      case VENDOR_CODES.TARGET:
        orderData = await Target.parse(code, payload);
        break;
      case VENDOR_CODES.TJMAXX:
        orderData = await TJMaxx.parse(code, payload);
        break;
      case VENDOR_CODES.UNDERARMOUR:
        orderData = await UnderArmour.parse(code, payload);
        break;
      case VENDOR_CODES.VICTORIASECRET:
        orderData = await VictoriaSecret.parse(code, payload);
        break;
      case VENDOR_CODES.WALMART:
        orderData = await Walmart.parse(code, payload);
        break;
      case VENDOR_CODES.WHITEHOUSE:
        orderData = await WhiteHouse.parse(code, payload);
        break;
      case VENDOR_CODES.ZARA:
        orderData = await Zara.parse(code, payload);
        break;
      case VENDOR_CODES.VANS:
        orderData = await Vans.parse(code, payload);
        break;
      case VENDOR_CODES.LUSH:
        orderData = await Lush.parse(code, payload);
        break;
      case VENDOR_CODES.MACCOSMETICS:
        orderData = await MacCosmetics.parse(code, payload);
        break;
      case VENDOR_CODES.LUCKYBRAND:
        orderData = await LuckyBrand.parse(code, payload);
        break;
      case VENDOR_CODES.MICHAELKORS:
        orderData = await MichaelKors.parse(code, payload);
        break;
      case VENDOR_CODES.DILLARDS:
        orderData = await Dillards.parse(code, payload);
        break;
      case VENDOR_CODES.ALTARDSTATE:
        orderData = await AltardState.parse(code, payload);
        break;
      case VENDOR_CODES.ANNTAYLOR:
        orderData = await AnnTaylor.parse(code, payload);
        break;
      case VENDOR_CODES.ATHLETA:
        orderData = await Athleta.parse(code, payload);
        break;
      case VENDOR_CODES.AVEDA:
        orderData = await Aveda.parse(code, payload);
        break;
      case VENDOR_CODES.BRIGHTONCOLLECTIBLES:
        orderData = await BrightonCollectibles.parse(code, payload);
        break;
      case VENDOR_CODES.COACH:
        orderData = await Coach.parse(code, payload);
        break;
      case VENDOR_CODES.FOREVER21:
        orderData = await Forever21.parse(code, payload);
        break;
      case VENDOR_CODES.GUCCI:
        orderData = await Gucci.parse(code, payload);
        break;
      case VENDOR_CODES.BURBERRY:
        orderData = await Burberry.parse(code, payload);
        break;
      case VENDOR_CODES.CLAIRES:
        orderData = await Claires.parse(code, payload);
        break;
      case VENDOR_CODES.DAKOTAWATCH:
        orderData = await DakotaWatch.parse(code, payload);
        break;
      case VENDOR_CODES.DAVIDYURMAN:
        orderData = await DavidYurman.parse(code, payload);
        break;
      case VENDOR_CODES.EVERYTHINGBUTWATER:
        orderData = await EverythingButWater.parse(code, payload);
        break;
      case VENDOR_CODES.FABLETICS:
        orderData = await Fabletics.parse(code, payload);
        break;
      case VENDOR_CODES.KATESPADE:
        orderData = await KateSpade.parse(code, payload);
        break;
      case VENDOR_CODES.GNCLIVEWELL:
        orderData = await GNCLiveWell.parse(code, payload);
        break;
      case VENDOR_CODES.GOLDENGOOSE:
        orderData = await GoldenGoose.parse(code, payload);
        break;
      case VENDOR_CODES.GUSMAYER:
        orderData = await GusMayer.parse(code, payload);
        break;
      case VENDOR_CODES.FREEBIRD:
        orderData = await Freebird.parse(code, payload);
        break;
      case VENDOR_CODES.JOHNNYWAS:
        orderData = await JohnnyWas.parse(code, payload);
        break;
      case VENDOR_CODES.JOHNSTONANDMURPHY:
        orderData = await JohnstonAndMurphy.parse(code, payload);
        break;
      case VENDOR_CODES.JOSABANK:
        orderData = await JosABank.parse(code, payload);
        break;
      case VENDOR_CODES.KAYJEWELERS:
        orderData = await KayJewelers.parse(code, payload);
        break;
      case VENDOR_CODES.KIEHLSSINCE1851:
        orderData = await KiehlsSince1851.parse(code, payload);
        break;
      case VENDOR_CODES.LILLYPULITZER:
        orderData = await LillyPulitzer.parse(code, payload);
        break;
      case VENDOR_CODES.MARMI:
        orderData = await Marmi.parse(code, payload);
        break;
      case VENDOR_CODES.MOLLYGREEN:
        orderData = await MollyGreen.parse(code, payload);
        break;
      case VENDOR_CODES.MORPHE:
        orderData = await Morphe.parse(code, payload);
        break;
      case VENDOR_CODES.PANDORA:
        orderData = await Pandora.parse(code, payload);
        break;
      case VENDOR_CODES.SOFTSURROUNDINGS:
        orderData = await SoftSurroundings.parse(code, payload);
        break;
      case VENDOR_CODES.SEPHORA:
        orderData = await Sephora.parse(code, payload);
        break;
      case VENDOR_CODES.SUNDANCE:
        orderData = await Sundance.parse(code, payload);
        break;
      case VENDOR_CODES.SUNGLASSHUT:
        orderData = await SunglassHut.parse(code, payload);
        break;
      case VENDOR_CODES.THECONTAINERSTORE:
        orderData = await TheContainerStore.parse(code, payload);
        break;
      case VENDOR_CODES.TIFFANYANDCO:
        orderData = await TiffanyAndCo.parse(code, payload);
        break;
      case VENDOR_CODES.TOMMYJOHN:
        orderData = await TommyJohn.parse(code, payload);
        break;
      case VENDOR_CODES.TORYBURCH:
        orderData = await ToryBurch.parse(code, payload);
        break;
      case VENDOR_CODES.UNTUCKIT:
        orderData = await Untuckit.parse(code, payload);
        break;
      case VENDOR_CODES.WILLIAMSSONOMA:
        orderData = await WilliamsSonoma.parse(code, payload);
        break;
      case VENDOR_CODES.JJILL:
        orderData = await JJill.parse(code, payload);
        break;
      case VENDOR_CODES.CRATEANDBARREL:
        orderData = await CrateAndBarrel.parse(code, payload);
        break;
      case VENDOR_CODES.BOGNARANDPICCOLINI:
        orderData = await BognarAndPiccolini.parse(code, payload);
        break;
      case VENDOR_CODES.DRYGOODS:
        orderData = await DryGoods.parse(code, payload);
        break;
      case VENDOR_CODES.EILEENFISHER:
        orderData = await EileenFisher.parse(code, payload);
        break;
      case VENDOR_CODES.APPLE:
        orderData = await Apple.parse(code, payload);
        break;
      case VENDOR_CODES.BUCKLE:
        orderData = await Buckle.parse(code, payload);
        break;
      case VENDOR_CODES.EVEREVE:
        orderData = await Evereve.parse(code, payload);
        break;
      case VENDOR_CODES.LOCCITANEENPROVENCE:
        orderData = await LoccitaneEnProvence.parse(code, payload);
        break;
      case VENDOR_CODES.ULTABEAUTY:
        orderData = await UltaBeauty.parse(code, payload);
        break;
      case VENDOR_CODES.LOFT:
        orderData = await Loft.parse(code, payload);
        break;
      case VENDOR_CODES.LULUS:
        orderData = await Lulus.parse(code, payload);
        break;
      case VENDOR_CODES.POTTERYBARN:
        orderData = await PotteryBarm.parse(code, payload);
        break;
      case VENDOR_CODES.ALEXPLUSNOVA:
        orderData = await AlexPlusNova.parse(code, payload);
        break;
      case VENDOR_CODES.AMAZINGLACE:
        orderData = await AmazingLace.parse(code, payload);
        break;
      case VENDOR_CODES.EAGLEEYEOUTFITTERS:
        orderData = await EagleEyeOutfitters.parse(code, payload);
        break;
      case VENDOR_CODES.PLT:
        orderData = await PrettyLittleThing.parse(code, payload);
        break;
      case VENDOR_CODES.SKIMS:
        orderData = await Skims.parse(code, payload);
        break;
      case VENDOR_CODES.ERINCONDREN:
        orderData = await ErinCondren.parse(code, payload);
        break;
      default:
        break;
    }

    return orderData;
  } catch (error) {
    log.info({
      message: error.message,
      code
    });
  }
};

export default parse;
