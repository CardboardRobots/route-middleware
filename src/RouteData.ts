import { IncomingMessage } from 'http';
import { URL } from 'url';

import { getVerb, Verb } from './verb/Verb';
import { ContentType } from './ContentType';

export interface RouteData {
    route: {
        /** HTTP Verb */
        method: Verb;
        /** URL */
        url: URL;
        /** HTTP Content-Type header */
        contentType: ContentType;
        /** HTTP Accept Header */
        accept: string[];
    };
}

export function createRouteData(request: IncomingMessage) {
    return {
        method: getMethod(request),
        url: getUrl(request),
        accept: getAccept(request),
        contentType: getContentType(request),
    };
}

export function getUrl(request: IncomingMessage) {
    return new URL(request.url ?? '', `http://${request.headers.host}`);
}

export function getMethod(request: IncomingMessage) {
    return getVerb(request.method);
}

export function getContentType(request: IncomingMessage) {
    const contentTypeHeader = request.headers['content-type'];
    const contentType: ContentType = {};
    if (contentTypeHeader) {
        const parts = contentTypeHeader.split('; ');
        contentType.mediaType = parts[0].trim().toLowerCase();
        if (parts.length > 1) {
            const hash: Record<string, any> = {};
            for (let index = 1, length = parts.length; index < length; index++) {
                const part = parts[index];
                const hashParts = part.split('=');
                if (hashParts.length > 1) {
                    hash[hashParts[0].trim()] = hashParts[1].trim();
                }
            }
            contentType.charset = hash.charset;
            contentType.boundary = hash.boundary;
        }
    }
    return contentType;
}

export function getAccept(request: IncomingMessage) {
    const accept = request.headers.accept;
    if (accept) {
        const types = accept.split(',');
        return types.map((type) => {
            const parts = type.split(';');
            return parts[0];
        });
    } else {
        return [];
    }
}
