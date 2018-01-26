import * as React from "react";
import { DrawerNavigator } from "react-navigation";
import {menu} from "./components/Menu";
import {Diagnostic} from "./components/Diagnostic";
import {Signature} from "./components/Signature";
import {Encryption} from "./components/Encryption";
import {Certificate} from "./components/Certificate";
import {Repository} from "./components/Repository";
import {Journal} from "./components/Journal";
import {SideBar} from "./components/SideBar";

export const app = DrawerNavigator({
  Menu: { screen: menu},
  Diagnostic: { screen: Diagnostic },
  Signature: { screen: Signature },
  Encryption: { screen: Encryption },
  Certificate: { screen: Certificate },
  Repository: { screen: Repository},
  Journal: { screen: Journal}
},
{
  contentComponent: props => <SideBar {...props} />
});