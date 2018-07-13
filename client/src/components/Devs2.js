import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Collapsible from 'react-collapsible';
import './Devs2.css'
class Devs2 extends Component {

     dev = [
        {
            id: 'anthony',
            name: 'Anthony Catalfo',
            email: 'nagubalpngnysbBlnubbApbz',
            picture: 'https://ca.slack-edge.com/T4JUEB3ME-U8CBJCJ7K-d19907ad71bb-72'
        },
        {
            id: 'peter',
            name: 'Peter Grey',
            email: 'crgreterlBlnubbApbz',
            picture: 'https://ca.slack-edge.com/T4JUEB3ME-U7P5N0KEC-5c660ff183b4-48'
        },
        {
            id: 'richard',
            name: 'Richard Reis',
            email: 'evpuneqervfBlnubbApbz',
            picture: 'https://ca.slack-edge.com/T4JUEB3ME-U7J9CUMU2-2749fb51b912-48'
        },
        {
            id: 'igor',
            name: 'Igor Yermak',
            email: 'vtbelreznxBlnubbApbz',
            picture: 'https://ca.slack-edge.com/T4JUEB3ME-U6PLJKDC1-9f8ccee199de-48'
        },

    ]
    
    cipher = str => {
        let arr = str.split('');
        let result = arr.map(function(letter) {
            if (letter.charCodeAt() > 96 && letter.charCodeAt() < 123) {
                if (letter.charCodeAt() > 109) {
                    return String.fromCharCode(letter.charCodeAt() - 13);
                } else {
                    return String.fromCharCode(letter.charCodeAt() + 13);
                }
            }
        
                switch(letter.charCodeAt()) {
            case 65:
                return String.fromCharCode('.'.charCodeAt());
                
            case 66:
                return String.fromCharCode('@'.charCodeAt());
                
            default:
                break;
    
            }
            return letter;
        });
        return result.join('');
    };
   
    


    render() {
        return(
         
            <div className="Devs2">
            <h1 className="Header">The Team</h1>
            
            <ul>
              {this.dev.map(character => (
                 
                <Collapsible key={character.id}trigger="" open={true} >
                    <li>{character.name}</li>
                    <li><img width={120} height={80} src={character.picture}/></li>
                    <li>Email: {this.cipher(character.email)}</li>
                   
    
                  
                </Collapsible>
              ))}
            </ul>
          </div>
        );
      }
    }
    
    export default Devs2;
    