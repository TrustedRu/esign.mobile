import * as React from "react";
import { Container, List, Content } from "native-base";
import { Headers } from "./Headers";
import { ListMenu } from "./ListMenu";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { readCertKeys } from "../actions/CertKeysAction";
import { PropertiesCert } from "./PropertiesCert";

function mapStateToProps(state) {
   return {
      otherCertKeys: state.certKeys.otherCertKeys
   };
}

function mapDispatchToProps(dispatch) {
   return {
      readCertKeys: bindActionCreators(readCertKeys, dispatch)
   };
}

interface OtherСertProps {
   navigation: any;
   otherCertKeys: any;
   readCertKeys(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class OtherСert extends React.Component<OtherСertProps> {

   static navigationOptions = {
      header: null
   };

   ShowList(img) {
      return (
         this.props.otherCertKeys.map((cert, key) => <ListMenu
            key={key}
            title={cert.name}
            note={cert.mtime}
            img={img[key]}
            nav={() => this.props.navigation.navigate("PropertiesCert", { cert: cert })} />));
   }

   render() {
      const { otherCertKeys } = this.props;
      const { goBack } = this.props.navigation;

      let img = [];
      for (let i = 0; i < otherCertKeys.length; i++) { // какое расширение у файлов
         switch (otherCertKeys[i].extension) {
            default:
               img[i] = require("../../imgs/general/cert2_ok_icon.png"); break;
         }
      }

      return (
         <Container style={styles.container}>
            <Headers title="Сертификаты других пользователей" goBack={() => goBack()} />
            <Content>
               <List>
                  {this.ShowList(img)}
               </List>
            </Content>
         </Container>
      );
   }

   componentDidMount() {
      this.props.readCertKeys();
   }
}