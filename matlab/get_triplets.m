function triplets = get_triplets(I)

%I = rgb2lab(I);

% Ottieni dimensioni
%I = double(I);
[m,n,~] = size(I);

% Ottieni un vettore di triplette LAB
I = reshape(I,[m*n 3]);

% Conserva le triplette uniche
triplets = unique(I,'rows');

% Se l'immagine I è stata segmentata con Color Thresholder, la prima riga conterrà lo zero
% assoluto [0 0 0], quindi con questo comando viene rimosso
triplets(1,:) = [];    

end

